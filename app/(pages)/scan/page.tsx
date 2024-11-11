"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner"; // Assuming you have a spinner component
import { AttendeeWithEntries } from "@/app/interfaces";

const Scan = () => {
  const [barcode, setBarcode] = useState<string>("");
  const [userData, setUserData] = useState<AttendeeWithEntries | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3); // Countdown timer
  const inputRef = useRef<HTMLInputElement>(null); // Ref for input focusing

  useEffect(() => {
    // Focus input when dialog closes
    if (!isDialogOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDialogOpen]);

  const submitBarcode = () => {
    setLoading(true); // Show loader immediately
    setIsDialogOpen(true); // Open dialog right after button click
    setCountdown(3); // Reset countdown

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
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed: User not found");
      })
      .finally(() => {
        setLoading(false); // Stop loading after response

        // Start countdown
        const countdownInterval = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown === 1) {
              clearInterval(countdownInterval); // Clear interval at end
              setIsDialogOpen(false); // Close dialog after countdown
              setBarcode(""); // Clear barcode input
            }
            return prevCountdown - 1;
          });
        }, 1000);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Enter Barcode
        </h2>
        <input
          ref={inputRef} // Attach ref to input for focusing
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

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) inputRef.current?.focus(); // Focus input on close
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attendee Details</DialogTitle>
            <DialogDescription>
              Information of the scanned ID.
            </DialogDescription>
          </DialogHeader>
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Spinner size="large" /> {/* Show spinner while loading */}
            </div>
          ) : (
            <>
              {userData ? (
                <div className="space-y-4">
                  <p>
                    <strong>ID:</strong> {userData.id}
                  </p>
                  <p>
                    <strong>First Name:</strong> {userData.firstName}
                  </p>
                  <p>
                    <strong>Last Name:</strong> {userData.lastName}
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
                        {userData.entries[0].day.toString()}, {""}
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
              <p className="text-gray-500 mt-4">Closing in {countdown}...</p>{" "}
              {/* Countdown text */}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Scan;
