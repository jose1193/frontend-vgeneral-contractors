import React from "react";
import { Typography as MuiTypography, SxProps, Theme } from "@mui/material";

interface TypographyStepLabelProps {
  children: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
}

const TypographyStepLabel: React.FC<TypographyStepLabelProps> = ({
  children,
  color = "inherit",
  sx = {},
}) => {
  const typographySx: SxProps<Theme> = {
    color: color,
    fontWeight: "medium",
    fontSize: {
      xs: "9px",
      sm: "10px",
      md: "12px",
      lg: "14px",
    },
    lineHeight: {},
    ...sx,
  };

  return (
    <MuiTypography component="span" sx={typographySx}>
      {children}
    </MuiTypography>
  );
};

export default TypographyStepLabel;
