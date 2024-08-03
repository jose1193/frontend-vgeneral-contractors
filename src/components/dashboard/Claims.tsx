"use client";
import React from "react";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { Paper, Box, Grid, Chip } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { withRoleProtection } from "../withRoleProtection";

// Define el tipo para tus datos
interface ClaimData {
  id: number;
  dateReported: Date;
  customerName: string;
  propertyAddress: string;
  damageType: string;
  estimatedCost: number;
  status: string;
  assignedTechnician: string;
  insuranceProvider: string;
}

// Define las columnas con el tipo correcto
const columns: GridColDef<ClaimData>[] = [
  { field: "id", headerName: "Claim ID", width: 90 },
  {
    field: "dateReported",
    headerName: "Date Reported",
    width: 150,
    type: "date",
  },
  { field: "customerName", headerName: "Customer Name", width: 150 },
  { field: "propertyAddress", headerName: "Property Address", width: 200 },
  { field: "damageType", headerName: "Damage Type", width: 130 },
  {
    field: "estimatedCost",
    headerName: "Estimated Cost",
    width: 130,
    type: "number",
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => {
      let color:
        | "default"
        | "primary"
        | "secondary"
        | "error"
        | "info"
        | "success"
        | "warning";
      let label;
      switch (params.value) {
        case "Completed":
          color = "success";
          label = "Completed";
          break;
        case "In Progress":
          color = "warning";
          label = "In Progress";
          break;
        case "Pending":
          color = "default";
          label = "Pending";
          break;
        default:
          color = "default";
          label = params.value;
      }
      return <Chip label={label} color={color} />;
    },
  },
  {
    field: "assignedTechnician",
    headerName: "Assigned Technician",
    width: 180,
  },
  { field: "insuranceProvider", headerName: "Insurance Provider", width: 180 },
];

const sampleData: ClaimData[] = [
  {
    id: 1,
    dateReported: new Date("2024-07-01"),
    customerName: "John Doe",
    propertyAddress: "123 Main St, Anytown, USA",
    damageType: "Water Damage",
    estimatedCost: 5000,
    status: "In Progress",
    assignedTechnician: "Mike Smith",
    insuranceProvider: "ABC Insurance",
  },
  {
    id: 2,
    dateReported: new Date("2024-07-02"),
    customerName: "Jane Smith",
    propertyAddress: "456 Oak Rd, Othertown, USA",
    damageType: "Fire Damage",
    estimatedCost: 15000,
    status: "Pending",
    assignedTechnician: "Sarah Johnson",
    insuranceProvider: "XYZ Insurance",
  },
  {
    id: 3,
    dateReported: new Date("2024-07-03"),
    customerName: "Bob Brown",
    propertyAddress: "789 Pine Ave, Somewhere, USA",
    damageType: "Mold Remediation",
    estimatedCost: 3000,
    status: "Completed",
    assignedTechnician: "Tom Wilson",
    insuranceProvider: "DEF Insurance",
  },
  // Agrega más filas según sea necesario
];

function ClaimsReport() {
  const theme = useTheme();
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
              p: 2,
              mb: 5,
              height: 400,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              overflow: "hidden",
              "& .MuiDataGrid-root": {
                border: "none",
              },
              width: "100%",
              overflowX: "auto",
            }}
          >
            <DataGrid
              rows={sampleData}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5, page: 0 },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              checkboxSelection
              disableRowSelectionOnClick
              slots={{
                toolbar: GridToolbar,
              }}
              sx={{
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
                p: { xs: 1, sm: 2, md: 3 },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
export default withRoleProtection(ClaimsReport, [
  "Super Admin",
  "Admin",
  "Manager",
  "Lead",
]);
