export interface Permission {
  id: number;
  name: string;
}
export interface RolesData {
  id: number;
  name: string;
  permissions: number[];
}
