import React from "react";
import { Typography as MuiTypography, SxProps, Theme } from "@mui/material";
import { Box } from "@mui/material";
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
    ml: 4,
    fontSize: {
      xs: "1.5rem",
      sm: "1.75rem",
      md: "2rem",
      lg: "2.25rem",
    },
    fontWeight: "bold",
    color: color,
    ...sx,
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <MuiTypography
        variant="h4"
        component={component}
        gutterBottom={gutterBottom}
        sx={typographySx}
      >
        {children}
      </MuiTypography>
    </Box>
  );
};

export default TypographyHeading;
