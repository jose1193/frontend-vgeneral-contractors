import React from "react";
import { Button, SxProps, Theme } from "@mui/material";

interface CustomButtonProps {
  onClick: () => void;
  startIcon?: React.ReactNode;
  children: React.ReactNode;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  mb?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  startIcon,
  children,
  backgroundColor = "#c2410c",
  hoverBackgroundColor = "#9a3412",
  mb = 5,
}) => {
  const buttonSx: SxProps<Theme> = {
    backgroundColor: backgroundColor,
    color: "#fff",
    mb: mb,
    fontSize: {
      xs: "10px",
      sm: "11px",
      md: "12px",
      lg: "14px",
    },
    fontWeight: "bold",
    padding: {
      xs: "6px 12px",
      sm: "7px 14px",
      md: "8px 16px",
      lg: "10px 20px",
    },
    "&:hover": {
      backgroundColor: hoverBackgroundColor,
      color: "#fff",
    },
  };

  return (
    <Button
      variant="contained"
      sx={buttonSx}
      onClick={onClick}
      startIcon={startIcon}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
