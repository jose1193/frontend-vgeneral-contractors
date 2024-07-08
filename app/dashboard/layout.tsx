import { Container, Grid, Box, Typography, Paper, Link } from "@mui/material";
import SideBar from "../components/SideBar";

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
      {children}
    </Box>
  );
}
