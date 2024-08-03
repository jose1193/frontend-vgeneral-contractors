import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { withRoleProtection } from "../withRoleProtection";

const data = [
  { name: "Invoice", value: 4000 },
  { name: "Collection", value: 3000 },
  { name: "Collected", value: 2000 },
  { name: "Discounted", value: 2780 },
  { name: "Receivable", value: 1890 },
];

const FinancialSummary = () => {
  return (
    <Paper
      elevation={6}
      sx={{
        p: 3, // Aumenta el padding interno
        mt: 4, // Añade margen superior
        mb: 4, // Añade margen inferior

        color: "white",
        borderRadius: 2, // Añade bordes redondeados
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {data.map((item) => (
              <Paper
                key={item.name}
                elevation={3}
                sx={{
                  p: 1,
                  flex: "1 1 calc(33% - 8px)",
                  minWidth: "120px",
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }} variant="h6">
                  {item.name}
                </Typography>
                <Typography variant="h5">
                  ${item.value.toLocaleString()}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
export default withRoleProtection(FinancialSummary, [
  "Super Admin",
  "Admin",
  "Manager",
]);
