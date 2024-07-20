import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  ListItemButton,
  Paper,
} from "@mui/material";

function Participants({ members }) {
  console.log(members[0]);
  return (
    <>
      <div className="flex flex-row justify-center p-0 participants-container">
        {members.map((user) => (
          <Paper key={user.username} elevation={3} sx={{ margin: 1 }}>
            <Card sx={{ width: 135, height: 125 }}>
              <CardMedia
                component="img"
                sx={{
                  height: 100,
                  width: 135,
                  backgroundColor: "white",
                }}
                image={`https://robohash.org//${user.username}.png`}
                alt={user.username}
              />
              <CardContent className="p-1 text-center">
                <Typography variant="caption" component="div">
                  {user.username}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        ))}
      </div>
      <style jsx>{`
        .participants-container {
          overflow-x: auto;
          scrollbar-width: thin; /* Firefox */
        }

        .participants-container::-webkit-scrollbar {
          height: 8px;
        }

        .participants-container::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }

        .participants-container::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </>
  );
}

export default Participants;
