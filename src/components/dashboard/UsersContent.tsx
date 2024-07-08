"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { Paper, Box, Grid } from "@mui/material";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "username", headerName: "Username", width: 130 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "phone", headerName: "Phone", width: 150 },
  { field: "website", headerName: "Website", width: 130 },
];

export default function Users() {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data: User[]) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Box
      component="section"
      sx={{
        flexGrow: 1,
        pr: { xs: 2, sm: 3, md: 4 }, // Padding derecho
        pl: { xs: 1, sm: 2, md: 3 }, // Padding izquierdo reducido
        py: { xs: 2, sm: 3, md: 4 }, // Padding vertical
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 5,
              height: 400,
              width: "100%",
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              overflow: "hidden",
              "& .MuiDataGrid-root": {
                border: "none",
              },
            }}
          >
            <DataGrid
              rows={users}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
