export interface ServiceRequestData {
  id?: number;
  uuid?: string;
  requested_service: string;
  created_at?: string | null;
  updated_at?: string | null;
}
