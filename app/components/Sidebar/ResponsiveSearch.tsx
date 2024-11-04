import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import { InputBase, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const SearchContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    position: "static",
  },
}));

const SearchWrapper = styled("div")<{ isOpen: boolean }>(
  ({ theme, isOpen }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    width: "100%",
    marginRight: theme.spacing(2),
    marginLeft: 0,
    display: "flex",
    alignItems: "center", // Añadido para alinear elementos horizontalmente

    [theme.breakpoints.up("md")]: {
      width: "auto",
      minWidth: "300px",
      "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
    },

    [theme.breakpoints.down("md")]: {
      display: isOpen ? "flex" : "none", // Cambiado a flex
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: theme.zIndex.drawer + 2,
      backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#000000",
      padding: theme.spacing(1.5),
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      "&:hover": {
        backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#000000",
      },
    },
  })
);

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: theme.spacing(6),
    transition: theme.transitions.create("width"),
    width: "100%",
    fontSize: "1rem",
    opacity: 1,
    height: "24px",
    lineHeight: "24px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
  left: theme.spacing(2), // Posición fija desde la izquierda
  zIndex: 1,
}));

const MobileSearchButton = styled(IconButton)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("md")]: {
    display: "flex",
    color: theme.palette.common.white,
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  padding: theme.spacing(1),
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
      <MobileSearchButton
        onClick={handleSearchClick}
        size="large"
        aria-label="search"
      >
        <SearchIcon />
      </MobileSearchButton>

      <SearchWrapper isOpen={isOpen}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          value={searchQuery}
          onChange={handleSearchChange}
          inputProps={{ "aria-label": "search" }}
          autoFocus={isOpen}
        />
        {isOpen && (
          <CloseButton
            size="small"
            onClick={handleClose}
            aria-label="close search"
          >
            <CloseIcon />
          </CloseButton>
        )}
      </SearchWrapper>
    </SearchContainer>
  );
};

export default ResponsiveSearch;
