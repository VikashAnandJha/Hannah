"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Participants from "./Participants";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Paper } from "@mui/material";
import {
  CallEnd,
  CallSharp,
  Mic,
  MicOff,
  VoiceChat,
} from "@mui/icons-material";
import Image from "next/image";

const CallComponent = ({ meetingId, userName }) => {
  const socketRef = useRef(null);
  const audioContextRef = useRef(null);
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

    socketRef.current.on("audioStream", (data) => {
      console.log(
        "audio coming from ",
        data.userName == userName ? "me" : data.userName
      );

      if (data.userName == userName) return;
      const audioData = data.audioData;
      const newData = audioData.split(";");
      newData[0] = "data:audio/ogg;";
      const audioSrc = newData.join(";");

      fetch(audioSrc)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) =>
          audioContextRef.current.decodeAudioData(arrayBuffer)
        )
        .then((audioBuffer) => {
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          source.start();
        })
        .catch((error) => console.error("Error playing audio:", error));
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
            const dataToSend = {
              userName,
              audioData: base64String,
            };
            socketRef.current.emit("audioStream", dataToSend);
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

  const handleUserInteraction = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
  };

  return (
    <div className="min-h-screen p-1" onClick={handleUserInteraction}>
      <Participants members={participantsList} />

      <div className="flex flex-col justify-between items-center">
        <div className="flex flex-col flex-grow-1 justify-center mt-4 space-x-2">
          <div className="flex flex-row flex-grow flex-grow-1 text-center">
            <Paper
              square={false}
              elevation={3}
              sx={{
                width: "50vw",
                height: "50vh",

                flexGrow: 1,
              }}
              className="m-1 text-center"
            />
          </div>
          <span
            style={{
              marginTop: -50,
              opacity: 0.6,
            }}
          >
            <Image src="/logo.png" alt="logo" width={120} height={30} />
          </span>

          <div className="mt-2 p-2 text-center flex flex-row justify-between ">
            <div>
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  disabled={isRecording}
                  variant="contained"
                  color="success"
                >
                  <CallSharp />
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  disabled={!isRecording}
                  variant="contained"
                  color="error"
                >
                  <CallEnd />
                </Button>
              )}
              {/* <Button variant="contained" color="error">
                <MicOff />
              </Button>
              <Button variant="contained" color="error">
                <Mic />
              </Button> */}
            </div>
            <div className="ml-3">
              MeetingID:{" "}
              <span
                style={{
                  backgroundColor: "red",
                  fontSize: 10,
                  color: "white",
                }}
              >
                {meetingId}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallComponent;
