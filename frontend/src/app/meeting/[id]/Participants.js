import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { ListItemButton, Paper } from "@mui/material";

function Participants({ members }) {
  console.log(members[0]);
  return (
    <>
      {members.map((user) => (
        <Paper key={user.username} elevation={3} sx={{ margin: 1 }}>
          <List
            key={Math.random() * 1000}
            sx={{
              width: "100%",
              maxWidth: 360,
            }}
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  alt="Remy Sharp"
                  src={`https://robohash.org//${user.username}.png`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={user.username}
                secondary={
                  <span className="font-thin text-green-500">online</span>
                }
              />
            </ListItemButton>
          </List>
        </Paper>
      ))}
    </>
  );
}

export default Participants;
