import prisma from "@/app/lib/prisma";
import { AttendeeWithEntries } from "@/app/interfaces";
import { NextResponse } from "next/server";

export const GET = async () => {
  const attendees = (await prisma.attendee.findMany({
    include: {
      entries: {
        orderBy: {
          day: "desc",
          time: "desc",
        },
      },
    },
  })) as AttendeeWithEntries[];

  console.log(attendees);

  return NextResponse.json(attendees);
};
