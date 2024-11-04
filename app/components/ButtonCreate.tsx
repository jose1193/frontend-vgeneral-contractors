import React, { ReactNode } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
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

const ButtonCreate: React.FC<ButtonCreateProps> = ({ children, ...props }) => {
  return (
    <Box sx={{ mb: 4, ml: 2, mt: -1 }}>
      <StyledButton variant="contained" {...props}>
        {children}
      </StyledButton>
    </Box>
  );
};

export default ButtonCreate;
