"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const correctPIN = "3430";

  const handleSubmit = () => {
    if (pin === correctPIN) {
      Cookies.set("auth", "authenticated", { expires: 1 });
      router.push("/attendees");
    } else {
      setError("Incorrect PIN. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Enter 4-Digit PIN
        </h2>
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          type="password"
          maxLength={4}
          placeholder="Enter PIN"
          className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button
          onClick={handleSubmit}
          className="w-full py-2 mt-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Auth;
