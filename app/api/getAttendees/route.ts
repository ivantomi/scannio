import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const attendees = await prisma.attendee.findMany({
      include: {
        entries: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const groupedAttendees = attendees.map((attendee) => {
      const groupedEntries = attendee.entries.reduce((acc, entry) => {
        if (!acc[entry.day]) {
          acc[entry.day] = [];
        }
        acc[entry.day].push(entry);
        return acc;
      }, {} as Record<string, typeof attendee.entries>);

      return {
        ...attendee,
        entriesGroupedByDay: groupedEntries,
      };
    });

    return NextResponse.json(groupedAttendees);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(error);
  }
};
