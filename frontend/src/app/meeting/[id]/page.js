"use client";
import React from "react";
import CallComponent from "./CallComponent";
import { useSearchParams } from "next/navigation";

function MeetingScreen({ params }) {
  const searchParams = useSearchParams();

  const userName = searchParams.get("name");
  return <CallComponent meetingId={params.id} userName={userName} />;
}

export default MeetingScreen;
