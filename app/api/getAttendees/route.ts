import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const attendees = await prisma.attendee.findMany({
    include: {
      entries: true,
    },
  });

  console.log(attendees);

  return NextResponse.json(attendees);
};
