"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AttendeeWithEntries } from "@/app/interfaces";

const Scan = () => {
  const [barcode, setBarcode] = useState<string>("");
  const [userData, setUserData] = useState<AttendeeWithEntries>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const submitBarcode = () => {
    fetch("/api/submitBarcode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ barcode: barcode }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("User not found");
        }
      })
      .then((data) => {
        setUserData(data.attendee);
        setIsDialogOpen(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed: User not found");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Enter Barcode
        </h2>
        <input
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          type="number"
          placeholder="Enter the Barcode or use the scanner"
          className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button
          onClick={submitBarcode}
          className="w-full py-2 mt-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attendee Details</DialogTitle>
            <DialogDescription>
              Information of the scanned ID.
            </DialogDescription>
          </DialogHeader>
          {userData ? (
            <div className="space-y-4">
              <p>
                <strong>ID:</strong> {userData.id}
              </p>
              <p>
                <strong>First Name:</strong> {userData.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {userData.firstName}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>School:</strong> {userData.school}
              </p>
              <p>
                <strong>Barcode:</strong> {userData.barcode}
              </p>
              <p>
                <strong>Last entry:</strong>{" "}
                {userData.entries.length > 0 ? (
                  <>
                    {userData.entries[0].day.toString()}, {""}{" "}
                    {userData.entries[0].time.toString()}
                  </>
                ) : (
                  "No entries found"
                )}
              </p>
            </div>
          ) : (
            <p>No user data available</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Scan;
