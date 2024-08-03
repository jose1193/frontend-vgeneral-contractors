import { Container, Grid, Box, Typography, Paper, Link } from "@mui/material";
import SideBar from "../components/SideBar";
import BasicSpeedDial from "../components/SupportButton";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box
      sx={{
        display: "flex",
        mt: 12,
      }}
    >
      <SideBar />
      <BasicSpeedDial />
      {children}
    </Box>
  );
}
