import React from "react";
import { Typography as MuiTypography, SxProps, Theme } from "@mui/material";

interface TypographyTitleProps {
  children: React.ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  color?: string;
  gutterBottom?: boolean;
  sx?: SxProps<Theme>;
}

const TypographyTitle: React.FC<TypographyTitleProps> = ({
  children,
  variant = "h4",
  color = "#662401",
  gutterBottom = true,
  sx = {},
}) => {
  const typographySx: SxProps<Theme> = {
    color: color,
    fontWeight: "bold",
    flexGrow: 1,
    fontSize: {
      xs: "16px",
      sm: "18px",
      md: "20px",
      lg: "24px",
    },
    lineHeight: {
      xs: 1.4,
      sm: 1.5,
      md: 1.6,
      lg: 1.7,
    },
    ...sx,
  };

  return (
    <MuiTypography
      variant={variant}
      sx={typographySx}
      gutterBottom={gutterBottom}
    >
      {children}
    </MuiTypography>
  );
};

export default TypographyTitle;
