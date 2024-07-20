"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Paper } from "@mui/material";

export default function Home() {
  const [name, setName] = useState("");
  const [meetingCode, setMeetingCode] = useState("testabcd");
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleJoinMeeting = () => {
    if (name.trim()) {
      router.push(`/meeting/${meetingCode}?name=${encodeURIComponent(name)}`);
    } else {
      alert("Please enter your name.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center  p-6">
      {showForm ? (
        <div className="w-full max-w-md">
          <Image
            src="/logo.png"
            alt="logo"
            width={120}
            height={30}
            className="mb-4"
          />
          <Paper
            elevation={3}
            className="p-6 bg-gray-800 rounded-lg text-center"
          >
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-700 text-white"
            />
            <button
              onClick={handleJoinMeeting}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Join Meeting
            </button>
          </Paper>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <Image src="/logo.png" alt="logo" width={220} height={50} />
        </div>
      )}
    </main>
  );
}
