import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const attendees = await req.json();

    if (!Array.isArray(attendees) || attendees.length === 0) {
      console.error("Received data is not an array or is empty");
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Invalid or empty data received.",
      });
    }

    console.log("Received attendees data:", attendees);

    const promises = attendees.map(async (attendee) => {
      if (
        !attendee.name ||
        !attendee.school ||
        !attendee.email ||
        !attendee.barcode
      ) {
        throw new Error("Missing required attendee fields.");
      }

      const checkIfExistAlready = await prisma.attendee.findFirst({
        where: {
          barcode: attendee.barcode,
        }
      })

      if (checkIfExistAlready) 
        return null;


      return prisma.attendee.create({
        data: {
          name: attendee.name,
          email: attendee.email,
          school: attendee.school,
          barcode: attendee.barcode,
        },
      });
    });

    await Promise.all(promises);

    return NextResponse.json({ status: 200, success: true });
  } catch (error) {
    console.error("Error importing attendees:", error);
    return NextResponse.json({ status: 500, success: false, message: error });
  }
};
