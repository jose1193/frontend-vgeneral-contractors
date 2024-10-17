import React from "react";
import { Typography as MuiTypography, SxProps, Theme } from "@mui/material";

interface CustomTypographyProps {
  children: React.ReactNode;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2";
  color?: string;
  gutterBottom?: boolean;
  sx?: SxProps<Theme>;
}

const CustomTypography: React.FC<CustomTypographyProps> = ({
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
    ...sx, // This allows for additional style overrides
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

export default CustomTypography;
