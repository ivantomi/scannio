import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { barcode } = body;

  console.log(barcode);

  try {
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

    const dayOfWeek = now.getDay(); 
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

    console.log(`Day: ${day}`);
    console.log(`Time: ${time}`);

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
