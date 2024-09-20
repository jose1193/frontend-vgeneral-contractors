import React from "react";
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Box,
} from "@mui/material";
import { ClaimsData } from "../../../app/types/claims";
interface ClaimDetailsProps {
  claim: ClaimsData | null;
}
const InvoiceTable: React.FC<ClaimDetailsProps> = ({ claim }) => {
  if (!claim) {
    return (
      <Paper elevation={3} sx={{ p: 5, mb: 7 }}>
        <Typography variant="h6" sx={{ color: "#662401" }}>
          Loading...
        </Typography>
      </Paper>
    );
  }
  return (
    <Paper
      elevation={3}
      sx={{
        backdropFilter: "blur(10px)",
        padding: 3,
        borderRadius: 2,
        mb: 5,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Typography variant="h6">INVOICES</Typography>
      </Box>

      <Box
        sx={{
          overflowX: "auto",
          width: "100%",
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.2)",
            borderRadius: "4px",
          },
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>CLAIM</TableCell>
              <TableCell>INVOICE</TableCell>
              <TableCell>NEGOTIATED</TableCell>
              <TableCell>%</TableCell>
              <TableCell>RECEIPT</TableCell>
              <TableCell>BALANCE DUE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>INVOICES</TableCell>
              <TableCell>TOTAL</TableCell>
              <TableCell>TOTAL</TableCell>
              <TableCell>TOTAL</TableCell>
              <TableCell>TOTAL</TableCell>
              <TableCell>TOTAL</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>0</TableCell>
              <TableCell>$0.00</TableCell>
              <TableCell>$0.00</TableCell>
              <TableCell>0.00%</TableCell>
              <TableCell>$0.00</TableCell>
              <TableCell>$0.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default InvoiceTable;
