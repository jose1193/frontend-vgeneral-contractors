// 4. API Actions (scopeSheetPresentationActions.ts)
import {
  ScopeSheetPresentationData,
  ScopeSheetPresentationCreateDTO,
  ScopeSheetPresentationUpdateDTO,
  ScopeSheetPresentationGetResponse,
  ScopeSheetPresentationListResponse,
  ScopeSheetPresentationDeleteResponse,
  ScopeSheetPresentationCreateResponse,
  ScopeSheetPresentationUpdateResponse,
} from "../../../app/types/scope-sheet-presentation";
import { fetchWithCSRF } from "../api";

// GET /api/scope-sheet-presentation
export const getPresentationListFetch = (
  token: string
): Promise<ScopeSheetPresentationListResponse> =>
  fetchWithCSRF("/api/scope-sheet-presentation", { method: "GET" }, token);

// GET /api/scope-sheet-presentation/{uuid}
export const getPresentationData = (
  token: string,
  uuid: string
): Promise<ScopeSheetPresentationGetResponse> =>
  fetchWithCSRF(
    `/api/scope-sheet-presentation/${uuid}`,
    { method: "GET" },
    token
  );

// POST /api/scope-sheet-presentation/store
export const createPresentationData = (
  token: string,
  data: ScopeSheetPresentationCreateDTO
): Promise<ScopeSheetPresentationCreateResponse> =>
  fetchWithCSRF(
    "/api/scope-sheet-presentation/store",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    token
  );

// POST /api/scope-sheet-presentation/store
export const uploadPresentationImages = (
  token: string,
  scope_sheet_uuid: string,
  files: File[],
  photo_type: string
): Promise<ScopeSheetPresentationCreateResponse> => {
  const formData = new FormData();
  formData.append('scope_sheet_uuid', scope_sheet_uuid);
  formData.append('photo_type', photo_type);
  
  // Append each file to photo_path array
  files.forEach(file => {
    formData.append('photo_path[]', file);
  });

  return fetchWithCSRF(
    "/api/scope-sheet-presentation/store",
    {
      method: "POST",
      body: formData,
    },
    token
  );
};

// POST /api/scope-sheet-presentation/update/{uuid}
// POST /api/scope-sheet-presentation/update/{uuid}
export const updatePresentationData = (
  token: string,
  uuid: string,
  scope_sheet_uuid: string,
  data: ScopeSheetPresentationUpdateDTO,
  files: File[]
): Promise<ScopeSheetPresentationUpdateResponse> => {
  const formData = new FormData();
  formData.append('scope_sheet_uuid', scope_sheet_uuid);
  
  // Agregar los datos de `ScopeSheetPresentationUpdateDTO` al FormData
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  // Agregar los archivos al FormData
  files.forEach((file) => {
    formData.append('photo_path[]', file);
  });

  return fetchWithCSRF(
    `/api/scope-sheet-presentation/update/${uuid}`,
    {
      method: "POST",
      body: formData,
    },
    token
  );
};


// DELETE /api/scope-sheet-presentation/delete/{uuid}
export const deletePresentationData = (
  token: string,
  uuid: string
): Promise<ScopeSheetPresentationDeleteResponse> =>
  fetchWithCSRF(
    `/api/scope-sheet-presentation/delete/${uuid}`,
    { method: "DELETE" },
    token
  );

// PUT /api/scope-sheet-presentation/reorder-images
export const reorderPresentationImages = (
  token: string,
  data: { id: number; photo_order: number }[]
): Promise<ScopeSheetPresentationListResponse> =>
  fetchWithCSRF(
    `/api/scope-sheet-presentation/reorder-images`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    token
  );
