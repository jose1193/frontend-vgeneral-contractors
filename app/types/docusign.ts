// app/types/docusign.ts
// Interfaz principal para los datos de DocuSign
import { ClaimsData } from "./claims";
import { UserData } from "./user";
export interface DocusignData {
  id?: number;
  uuid?: string | null;
  envelope_id?: string | null;
  claims: ClaimsData;
  claim_uuid?: string | null;
  claim_id?: number | null;
  generated_by: UserData;
  code?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// Para monitorear el estado de firma
export interface DocusignStatus {
  envelope_id: string;
  status: string;
  details: {
    status: string;
    envelopeId: string;
    emailSubject: string;
    sentDateTime: string;
    initialSentDateTime: string;
    sent_at: string;
    lastModifiedDateTime: string;
    status_changed_at: string;
    expireDateTime: string;
    documentsUri: string;
    recipientsUri: string;
    attachmentsUri: string;
    envelopeUri: string;
    signingLocation: string;
    customFieldsUri: string;
    notificationUri: string;
    enableWetSign: string;
    allowMarkup: string;
    allowReassign: string;
    documentsCombinedUri: string;
    certificateUri: string;
    templatesUri: string;
    expireEnabled: string;
    expireAfter: string;
    sender: {
      userName: string;
      userId: string;
      accountId: string;
      email: string;
      ipAddress?: string;
    };
  };
}

export interface DocumentWithStatus extends DocusignData {
  docusign_status?: DocusignStatus;
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

export interface DocusignImportDTO {
  claim_uuid: string;
  document: File;
}

export interface DocusignImportResponse {
  success: boolean;
  data: {
    envelope_id?: string;
    status?: string;
    message?: string;
  };
}
export interface DocusignDisconnectResponse {
  success: boolean;
  message: string;
}
