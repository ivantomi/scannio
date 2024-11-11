import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const attendees = await req.json();

    // Check if attendees is received correctly and is an array
    if (!Array.isArray(attendees) || attendees.length === 0) {
      console.error("Received data is not an array or is empty");
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Invalid or empty data received.",
      });
    }

    // Verify and log data to confirm structure
    console.log("Received attendees data:", attendees);

    const promises = attendees.map((attendee) => {
      if (
        !attendee.firstName ||
        !attendee.lastName ||
        !attendee.email ||
        !attendee.school ||
        !attendee.barcode
      ) {
        throw new Error("Missing required attendee fields.");
      }

      return prisma.attendee.create({
        data: {
          firstName: attendee.firstName,
          lastName: attendee.lastName,
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
