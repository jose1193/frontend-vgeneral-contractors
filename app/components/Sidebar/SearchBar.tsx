import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import { InputBase, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

// Estilos para el contenedor de búsqueda
const SearchContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    position: "static",
  },
}));

// Estilos para el campo de búsqueda expandible
const SearchWrapper = styled("div")<{ isOpen: boolean }>(
  ({ theme, isOpen }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "auto",
      minWidth: "300px",
    },
    [theme.breakpoints.down("md")]: {
      display: isOpen ? "block" : "none",
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#000",
      padding: theme.spacing(1),
      borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    },
  })
);

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: alpha(theme.palette.common.white, 0.7),
}));

const MobileSearchButton = styled(IconButton)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("md")]: {
    display: "flex",
    color: alpha(theme.palette.common.white, 0.7),
  },
}));

const ResponsiveSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <SearchContainer>
      {/* Botón de búsqueda móvil */}
      <MobileSearchButton
        onClick={handleSearchClick}
        size="large"
        aria-label="search"
      >
        <SearchIcon />
      </MobileSearchButton>

      {/* Campo de búsqueda */}
      <SearchWrapper isOpen={isOpen}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          value={searchQuery}
          onChange={handleSearchChange}
          inputProps={{ "aria-label": "search" }}
        />
        {isOpen && (
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              color: "inherit",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </SearchWrapper>
    </SearchContainer>
  );
};

export default ResponsiveSearch;
