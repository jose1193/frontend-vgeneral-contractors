// app/types/docusign.ts
// Interfaz principal para los datos de DocuSign
export interface DocusignData {
  id?: number;
  uuid?: string | null;
  envelope_id?: string | null;
  claim_uuid?: string | null;
  code?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// Para monitorear el estado de firma
export interface DocusignStatus {
  status: string;
  signed: boolean;
  email?: string;
  signed_at?: string | null;
  envelope_id: string;
}

// Para el proceso inicial de conexión
export interface DocusignConnect {
  success: boolean;
  data: {
    url: string;
  };
  message?: string | number;
}

// DTOs para las diferentes operaciones
export interface DocusignSignDTO {
  claim_uuid: string;
  code: string;
}

export interface DocusignCallbackDTO {
  code: string;
}

export interface DocusignCheckStatusDTO {
  envelope_id: string;
}

// Interfaces para las respuestas de la API
export interface DocusignSignResponse {
  success: boolean;
  data: {
    envelope_id?: string;
    status?: string;
    message?: string;
  };
}

export interface DocusignResponse {
  success: boolean;
  data: DocusignData;
  message?: string;
}

export interface DocusignListResponse {
  success: boolean;
  data: DocusignData[];
  message?: string;
}
