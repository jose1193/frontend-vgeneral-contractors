"use client";
import { Container, Grid, Box, Typography, Paper, Link } from "@mui/material";
import ResponsiveDrawer from "../components/Sidebar/ResponsiveDrawer";
import BasicSpeedDial from "../components/SupportButton";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ResponsiveDrawer>
      <BasicSpeedDial />
      {children}
    </ResponsiveDrawer>
  );
}
