import React from "react";
import { Button, SxProps, Theme } from "@mui/material";

interface ButtonGreenProps {
  onClick: () => void;
  startIcon?: React.ReactNode;
  children: React.ReactNode;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  mb?: number;
}

const ButtonGreen: React.FC<ButtonGreenProps> = ({
  onClick,
  startIcon,
  children,
  backgroundColor = "#16a34a",
  hoverBackgroundColor = "#15803d",
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

export default ButtonGreen;
