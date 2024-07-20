"use client";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

export default function DashboardLayout({ children }) {
  const darkTheme = createTheme({
    palette: {
      mode: "dark", //default theme
    },
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <section>{children}</section>
    </ThemeProvider>
  );
}
