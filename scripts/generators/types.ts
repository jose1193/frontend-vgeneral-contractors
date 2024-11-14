// scripts/generators/types.ts
export interface GeneratorConfig {
  name: string;
  pluralName: string;
  baseDir: string;
  fields: Field[];
}

export interface Field {
  name: string;
  type: string;
  required: boolean;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

export interface ValidationRule {
  name: string;
  type: string;
  required: boolean;
  validations: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface NavigationItem {
  name: string;
  path: string;
  icon?: string;
}

export interface DataTableColumn {
  field: string;
  headerName: string;
  width?: number;
  flex?: number;
  type?: string;
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (params: any) => JSX.Element;
}
export interface CrudConfig {
  name: string;
  fields: Field[];
}

export interface GeneratorConfig {
  name: string;
  pluralName: string;
  baseDir: string;
  fields: Field[];
}
