"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Participants from "./Participants";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Paper } from "@mui/material";
import { CallEnd, CallSharp } from "@mui/icons-material";
import Image from "next/image";

const CallComponent = ({ meetingId, userName }) => {
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [participantsList, setParticipantsList] = useState([]);

  useEffect(() => {
    // Initialize socket connection

    const socketUrl =
      window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://hannah-nextjs.onrender.com";

    socketRef.current = io(socketUrl, {
      transports: ["websocket"],
      upgrade: false,
    });
    socketRef.current.auth = { username: userName };
    socketRef.current.connect();

    socketRef.current.on("audioStream", (audioData) => {
      const newData = audioData.split(";");
      newData[0] = "data:audio/ogg;";
      const audioSrc = newData.join(";");
      const audio = new Audio(audioSrc);
      audio.play();
    });

    // Get participants
    socketRef.current.on("users", (users) => {
      console.log({ users });
      setParticipantsList(users);
    });

    return () => {
      // Clean up the socket connection on unmount
      if (intervalId) clearInterval(intervalId);
      socketRef.current.disconnect();
    };
  }, [intervalId]);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.addEventListener("dataavailable", (event) => {
          audioChunksRef.current.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunksRef.current);
          const fileReader = new FileReader();
          fileReader.readAsDataURL(audioBlob);
          fileReader.onloadend = () => {
            const base64String = fileReader.result;
            socketRef.current.emit("audioStream", base64String);
          };
          audioChunksRef.current = []; // Clear audio chunks after sending
        });

        mediaRecorder.start();
        setIsRecording(true);

        const id = setInterval(() => {
          mediaRecorder.stop();
          mediaRecorder.start();
        }, 1000);
        setIntervalId(id);
      })
      .catch((error) => {
        console.error("Error capturing audio.", error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      clearInterval(intervalId);
      setIntervalId(null);
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen   p-6">
      <div className="flex justify-between items-center  ">
        <Image src="/logo.png" alt="logo" width={120} height={30} />
        <h1 className="text-sm font-bold">
          Meeting ID:{" "}
          <span style={{ backgroundColor: "red", color: "white", padding: 5 }}>
            {meetingId}
          </span>
        </h1>
      </div>
      <Grid container spacing={2}>
        <Grid spacing={2} item xs={3} justifyItems={"center"}>
          <Participants members={participantsList} />
        </Grid>
        <Grid
          item
          xs={9}
          className=" p-4 rounded-lg flex flex-col justify-between items-center"
        >
          <Paper
            square={false}
            elevation={3}
            sx={{
              width: "80%",
              height: "70vh",
            }}
            className="min-h-10"
          />
          <div className=" justify-center mt-4 space-x-2">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                disabled={isRecording}
                variant="contained"
                color="success"
              >
                <CallSharp></CallSharp>
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                disabled={!isRecording}
                variant="contained"
                color="error"
              >
                <CallEnd></CallEnd>
              </Button>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default CallComponent;
