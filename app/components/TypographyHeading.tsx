import React from "react";
import { Typography as MuiTypography, SxProps, Theme } from "@mui/material";

interface TypographyHeadingProps {
  children: React.ReactNode;
  component?: React.ElementType;
  gutterBottom?: boolean;
  color?: string;
  sx?: SxProps<Theme>;
}

const TypographyHeading: React.FC<TypographyHeadingProps> = ({
  children,
  component = "h1",
  gutterBottom = true,
  color = "inherit",
  sx = {},
}) => {
  const typographySx: SxProps<Theme> = {
    mb: 5,
    fontSize: {
      xs: "1.5rem",
      sm: "1.75rem",
      md: "2rem",
      lg: "2.25rem",
    },
    fontWeight: "bold",
    color: color,
    ...sx, // This allows for additional style overrides
  };

  return (
    <MuiTypography
      variant="h4"
      component={component}
      gutterBottom={gutterBottom}
      sx={typographySx}
    >
      {children}
    </MuiTypography>
  );
};

export default TypographyHeading;
