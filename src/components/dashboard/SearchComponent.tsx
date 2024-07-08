import { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { styled, alpha } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
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
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const SearchComponent = () => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearchInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearchInput]);

  const handleSearchIconClick = () => {
    setShowSearchInput(true);
  };

  const handleCloseSearch = () => {
    setShowSearchInput(false);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
      {isSmallScreen ? (
        <>
          <IconButton
            onClick={handleSearchIconClick}
            aria-label="search"
            sx={{ color: "inherit" }} // Asegura que el icono sea visible
          >
            <SearchIcon />
          </IconButton>
          {showSearchInput && (
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary, // Asegura que el texto sea visible
                zIndex: theme.zIndex.appBar + 1,
                p: 1,
                display: "flex",
                alignItems: "center",
                boxShadow: theme.shadows[4], // Añade sombra para distinguirlo
              }}
            >
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                inputRef={inputRef}
                sx={{ flex: 1 }}
              />
              <IconButton onClick={handleCloseSearch}>
                <CloseIcon />
              </IconButton>
            </Box>
          )}
        </>
      ) : (
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
      )}
    </Box>
  );
};

export default SearchComponent;
