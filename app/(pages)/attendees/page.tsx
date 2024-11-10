"use client";
import React, { useEffect, useState } from "react";
import { AttendeeWithEntries } from "@/app/lib/types";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

const Attendees = () => {
  const [attendees, setAttendees] = useState<AttendeeWithEntries[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/getAttendees")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAttendees(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Email", "Entry Date", "Entry Time"];

    const rows = attendees.flatMap((attendee) =>
      attendee.entries.map((entry) => {
        return [
          attendee.id,
          attendee.name,
          attendee.email,
          entry.day,
          entry.time,
        ];
      })
    );

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendees_with_entries.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700">Attendees</h1>
        <Button
          onClick={exportToCSV}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Export to CSV
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size="large" show={true} className="text-primary" />
        </div>
      ) : (
        <Table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
          <TableCaption className="text-lg font-semibold text-gray-700 mb-4">
            List of all attendees
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-100 border-b">
              <TableHead className="w-[100px] px-4 py-3 text-left text-gray-600 font-medium">
                ID
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-600 font-medium">
                Name
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-600 font-medium">
                Email
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-gray-600 font-medium">
                Last Entry Date
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-gray-600 font-medium">
                Last Entry Time
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendees.map((attendee) => (
              <TableRow
                key={attendee.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="px-4 py-3 border-b text-gray-700">
                  {attendee.id}
                </TableCell>
                <TableCell className="px-4 py-3 border-b text-gray-700">
                  {attendee.name}
                </TableCell>
                <TableCell className="px-4 py-3 border-b text-gray-700">
                  {attendee.email}
                </TableCell>
                <TableCell className="px-4 py-3 border-b text-gray-700 text-right">
                  {attendee.entries.length > 0
                    ? attendee.entries[0].day.toString()
                    : "Never"}
                </TableCell>
                <TableCell className="px-4 py-3 border-b text-gray-700 text-right">
                  {attendee.entries.length > 0
                    ? attendee.entries[0].time.toString()
                    : "Never"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Attendees;
