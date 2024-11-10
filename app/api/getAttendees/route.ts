import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const attendees = await prisma.attendee.findMany({
      include: {
        entries: {
          orderBy: {
            day: "desc",
            time: "desc",
          },
        },
      },
    });
    return NextResponse.json(attendees);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(error);
  }
};
