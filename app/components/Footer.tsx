import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer: React.FC = () => {
  const appName = process.env.NEXT_APP_NAME || "V Mit Roof";

  return (
    <Box sx={{ mt: 8, mb: 4 }}>
      <Typography variant="body2" color="text.secondary" align="center">
        {"Copyright © "} {new Date().getFullYear()} |
        <Link
          sx={{ textDecoration: "none", fontWeight: "bold", p: 1 }}
          href="https://vgeneralcontractors.com/"
        >
          {appName}
        </Link>{" "}
        | V 1.0
      </Typography>
    </Box>
  );
};

export default Footer;
