import { PERMISSIONS } from "@/config/permissions";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export interface SubItem {
  name: string;
  href: string;
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  permission?: keyof typeof PERMISSIONS;
  disabled?: boolean;
}

export interface PageItem {
  name: string;
  href?: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  subItems?: SubItem[];
  permission?: keyof typeof PERMISSIONS;
  disabled?: boolean;
  divider?: boolean;
}
