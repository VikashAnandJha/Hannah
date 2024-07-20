"use client";
import { Roboto } from "next/font/google";
import "./globals.css";
const inter = Roboto({ subsets: ["latin"], weight: "400" });
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

export default function RootLayout({ children }) {
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
    <html lang="en">
      <title>Hannah : Free Video Confrencing </title>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <body className={inter.className}>{children}</body>
      </ThemeProvider>
    </html>
  );
}
