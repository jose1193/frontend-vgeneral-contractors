import {
  ClaimPublicAdjusterData,
  ClaimPublicAdjusterCreateDTO,
  ClaimPublicAdjusterUpdateDTO,
  ClaimPublicAdjusterResponse,
  ClaimPublicAdjusterListResponse,
  ClaimPublicAdjusterDeleteResponse
} from '../../../app/types/claim-public-adjuster';
import { fetchWithCSRF } from '../api';

export const getDataFetch = (token: string): Promise<ClaimPublicAdjusterListResponse> =>
  fetchWithCSRF('/api/claim-public-adjuster', { method: 'GET' }, token);

export const getData = (token: string, uuid: string): Promise<ClaimPublicAdjusterResponse> =>
  fetchWithCSRF(`/api/claim-public-adjuster/${uuid}`, { method: 'GET' }, token);

export const createData = (
  token: string,
  data: ClaimPublicAdjusterCreateDTO
): Promise<ClaimPublicAdjusterResponse> =>
  fetchWithCSRF(
    '/api/claim-public-adjuster/store',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    token
  );

export const updateData = (
  token: string,
  uuid: string,
  data: ClaimPublicAdjusterUpdateDTO
): Promise<ClaimPublicAdjusterResponse> =>
  fetchWithCSRF(
    `/api/claim-public-adjuster/update/${uuid}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    token
  );

export const deleteData = (token: string, uuid: string): Promise<ClaimPublicAdjusterDeleteResponse> =>
  fetchWithCSRF(`/api/claim-public-adjuster/delete/${uuid}`, { method: 'DELETE' }, token);

export const restoreData = (token: string, uuid: string): Promise<ClaimPublicAdjusterResponse> =>
  fetchWithCSRF(`/api/claim-public-adjuster/restore/${uuid}`, { method: 'PUT' }, token);