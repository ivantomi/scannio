import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { id } = body;

  try {
    // Find the attendee in the database
    const attendee = await prisma.attendee.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        entries: {
          orderBy: {
            day: "desc",
          },
        },
      },
    });

    if (!attendee) {
      return NextResponse.json({ status: 200, success: false });
    }

    // Get current date and time separately
    const now = new Date();

    // Format date to Croatian date format
    const day = new Intl.DateTimeFormat("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Europe/Zagreb",
    }).format(now);

    // Format time to Croatian time format (24-hour clock)
    const time = new Intl.DateTimeFormat("hr-HR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Europe/Zagreb",
    }).format(now);

    console.log(day); // Example output: "10.11.2024"
    console.log(time); // Example output: "15:30:00"

    // Ensure day and time are passed as strings
    await prisma.attendee.update({
      where: {
        id: Number(id),
      },
      data: {
        entries: {
          create: {
            day, // Already formatted as a string
            time, // Already formatted as a string
          },
        },
      },
    });

    return NextResponse.json({
      status: 200,
      success: true,
      attendee,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 200, success: false });
  }
};
