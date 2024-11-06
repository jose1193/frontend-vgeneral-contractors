import { UserData } from "./user";

export interface ZoneData {
  id?: number;
  uuid?: string;
  zone_name: string;
  zone_type: "interior" | "exterior";
  code?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  created_by_user: UserData;
}

// Para el formulario/peticiones
export interface ZoneFormData {
  zone_name: string;
  zone_type?: string | null;
  code?: string | null;
  description?: string | null;
}

// DTOs para las operaciones
export interface ZoneCreateDTO {
  zone_name: string;
  zone_type: "interior" | "exterior";
  code?: string;
  description?: string;
}

export interface ZoneUpdateDTO extends Partial<ZoneCreateDTO> {
  uuid: string;
}

// Interfaces para las respuestas de la API
export interface ZoneResponse {
  success: boolean;
  data: ZoneData;
  message?: string;
}

export interface ZoneListResponse {
  success: boolean;
  data: ZoneData[];
  message?: string;
}

export interface ZoneDeleteResponse {
  success: boolean;
  message: string;
}

export interface ZoneRestoreResponse {
  success: boolean;
  data: ZoneData;
  message: string;
}

// Interface para manejo de errores
export interface ZoneErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
