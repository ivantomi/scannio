"use client";
import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AttendeeWithEntries } from "@/app/interfaces";

const Scan = () => {
  const [barcode, setBarcode] = useState<string>("");
  const [userData, setUserData] = useState<AttendeeWithEntries | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(2);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null); 
  const router = useRouter();

  useEffect(() => {
    const authCookie = Cookies.get("auth");

    if (authCookie !== "authenticated" || isAuthenticated) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isDialogOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDialogOpen]);

  const submitBarcode = () => {
    setLoading(true); 
    setIsDialogOpen(true); 
    setCountdown(2); 

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
        setLoading(false);

        const countdownInterval = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown === 1) {
              clearInterval(countdownInterval); 
              setIsDialogOpen(false); 
              setBarcode(""); 
            }
            return prevCountdown - 1;
          });
        }, 1000);
      });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitBarcode();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <img
          src="/logo_ENTER-4_02.png"
          alt="Logo"
          className="mx-auto mb-4 w-32 h-auto"
        />
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Enter Barcode
        </h2>
        <input
          ref={inputRef}
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={handleKeyPress}
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
          if (!open) inputRef.current?.focus(); 
        }}
      >
        <DialogContent className="max-w-lg p-8 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Attendee Details
            </DialogTitle>
            <DialogDescription className="text-gray-700">
              Information of the scanned ID.
            </DialogDescription>
          </DialogHeader>
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Spinner size="large" className="text-black" />
            </div>
          ) : (
            <>
              {userData ? (
                <div className="space-y-4 text-lg">
                  <p className="text-gray-700">
                    <strong className="text-black">ID:</strong> {userData.id}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-black">Name:</strong>{" "}
                    {userData.name}
                  </p>
                  
                  <p className="text-gray-700">
                    <strong className="text-black">Email:</strong>{" "}
                    {userData.email}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-black">School:</strong>{" "}
                    {userData.school}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-black">Barcode:</strong>{" "}
                    {userData.barcode}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-black">Last entry:</strong>{" "}
                    {userData.entries.length > 0
                      ? userData.entries[0].day +
                        " - " +
                        userData.entries[0].time
                      : "No entries"}
                  </p>
                </div>
              ) : (
                <p className="text-lg text-gray-700">No user data available</p>
              )}
              <p className="text-gray-500 mt-4">Closing in {countdown}...</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Scan;
