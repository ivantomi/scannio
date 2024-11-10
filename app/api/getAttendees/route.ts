import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  const attendees = await prisma.attendee.findMany({
    include: {
      entries: true,
    },
  });

  console.log(attendees);

  return NextResponse.json(attendees);
};
