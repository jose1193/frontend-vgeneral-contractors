// types/menu.types.ts
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

export interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
