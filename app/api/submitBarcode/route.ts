import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { barcode } = body;

  console.log(barcode);

  try {
    // Find the attendee in the database
    const attendee = await prisma.attendee.findUnique({
      where: {
        barcode: Number(barcode),
      },
      include: {
        entries: {
          orderBy: {
            id: "desc",
          },
        },
      },
    });

    if (!attendee) {
      return NextResponse.json({ status: 200, success: false });
    }

    const now = new Date();

    // Determine the day enum based on the current day of the week
    const dayOfWeek = now.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6
    let day: "THURSDAY" | "FRIDAY" | "SATURDAY";

    if (dayOfWeek === 4) {
      day = "THURSDAY";
    } else if (dayOfWeek === 5) {
      day = "FRIDAY";
    } else if (dayOfWeek === 6) {
      day = "SATURDAY";
    } else {
      return NextResponse.json({
        status: 200,
        success: false,
        message: "Today is not a valid entry day",
      });
    }

    const time = new Intl.DateTimeFormat("hr-HR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Europe/Zagreb",
    }).format(now);

    console.log(`Day: ${day}`); // Should log "THURSDAY", "FRIDAY", or "SATURDAY" based on the current day
    console.log(`Time: ${time}`);

    // Create a new entry with the correct day and time
    await prisma.attendee.update({
      where: {
        barcode: Number(barcode),
      },
      data: {
        entries: {
          create: {
            day,
            time,
            createdAt: now,
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
