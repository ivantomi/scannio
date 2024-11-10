import prisma from "@/app/lib/prisma";
import { AttendeeWithEntries } from "@/app/lib/types";
import { NextResponse } from "next/server";

export const GET = async () => {
  const attendees = (await prisma.attendee.findMany({
    include: {
      entries: {
        orderBy: {
          day: "asc",
        },
      },
    },
  })) as AttendeeWithEntries[];

  console.log(attendees);

  return NextResponse.json(attendees);
};
