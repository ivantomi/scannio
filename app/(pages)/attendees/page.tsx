"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";

import { AttendeeWithEntries } from "@/app/interfaces";
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
import { useRouter } from "next/navigation";

const Attendees = () => {
  const [attendees, setAttendees] = useState<AttendeeWithEntries[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const authCookie = Cookies.get("auth");

    if (authCookie !== "authenticated" || isAuthenticated) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "School",
      "Barcode",
      "Entry Date",
      "Entry Time",
    ];

    const rows = attendees
      .map((attendee) => {
        if (attendee.entries.length > 0) {
          return attendee.entries.map((entry) => [
            attendee.firstName,
            attendee.lastName,
            attendee.email,
            attendee.school,
            attendee.barcode,
            entry.day || "N/A",
            entry.time || "N/A",
          ]);
        } else {
          return [
            [
              attendee.firstName,
              attendee.lastName,
              attendee.email,
              attendee.school,
              attendee.barcode,
              "N/A",
              "N/A",
            ],
          ];
        }
      })
      .flat();

    // Add the UTF-8 BOM to ensure Croatian letters display correctly
    const csvContent =
      "\uFEFF" + [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendees_with_entries.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadAttendees = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(worksheet);

      console.log(parsedData);

      const response = await fetch("/api/importAttendees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      if (response.ok) {
        alert("Attendees imported successfully!");
      } else {
        console.error("Failed to import attendees");
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold ">Attendees</h1>
        <Button
          onClick={exportToCSV}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Export to CSV
        </Button>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <Button
          onClick={uploadAttendees}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Upload Attendees
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size="large" show={true} className="text-primary" />
        </div>
      ) : (
        <Table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
          <TableCaption className="text-lg font-semibold text-white mb-4">
            List of all attendees
          </TableCaption>
          <TableHeader className="hover:bg-gray-100 bg-gray-200">
            <TableRow className="bg-gray-100 border-b">
              <TableHead className="w-[100px] px-4 py-3 text-left text-gray-600 font-medium">
                ID
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-600 font-medium">
                First Name
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-600 font-medium">
                Last Name
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-600 font-medium">
                Email
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-600 font-medium">
                School
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-600 font-medium">
                Barcode
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
                key={attendee.id.toString()}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="px-4 py-3 border-b text-gray-700">
                  {attendee.id}
                </TableCell>
                <TableCell className="px-4 py-3 border-b text-gray-700">
                  {attendee.firstName}
                </TableCell>
                <TableCell className="px-4 py-3 border-b text-gray-700">
                  {attendee.lastName}
                </TableCell>
                <TableCell className="px-4 py-3 border-b text-gray-700">
                  {attendee.email}
                </TableCell>
                <TableCell className="px-4 py-3 border-b text-gray-700">
                  {attendee.school}
                </TableCell>
                <TableCell className="px-4 py-3 border-b text-gray-700">
                  {attendee.barcode}
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
