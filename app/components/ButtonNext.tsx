import React, { ReactNode } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
interface ButtonCreateProps extends ButtonProps {
  children: ReactNode;
}

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#1E90FF",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#1871CD",
  },

  "&.MuiButton-containedPrimary": {
    backgroundColor: "#1E90FF",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#1871CD",
    },
  },

  "&:active, &:focus": {
    color: "#fff",
  },
}));

const ButtonNext: React.FC<ButtonCreateProps> = ({ children, ...props }) => {
  return (
    <StyledButton variant="contained" {...props} endIcon={<ArrowForwardIcon />}>
      {children}
    </StyledButton>
  );
};

export default ButtonNext;
