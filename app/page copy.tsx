// app/page.tsx
"use client";
import React from "react";
import { Button, Typography } from "@mui/material";
import { useTheme } from "./ui/StyledRoot";
import SignIn from "./auth/page";
import { useDemoData } from "@mui/x-data-grid-generator";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function Home() {
  const { toggleTheme } = useTheme();
  const { data, loading } = useDemoData({
    dataSet: "Commodity",
    rowLength: 10,
    maxColumns: 6,
  });
  return (
    <div>
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          {...data}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
        />
      </div>
      <Typography variant="h1">Hola, Mundo</Typography>
      <Button variant="contained" color="primary" onClick={toggleTheme}>
        Alternar Modo Oscuro/Claro
      </Button>
      <SignIn />
    </div>
  );
}
