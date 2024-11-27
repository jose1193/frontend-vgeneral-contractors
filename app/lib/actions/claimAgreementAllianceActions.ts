import {
  ClaimAgreementAllianceData,
  ClaimAgreementAllianceCreateDTO,
  ClaimAgreementAllianceUpdateDTO,
  ClaimAgreementAllianceResponse,
  ClaimAgreementAllianceListResponse,
  ClaimAgreementAllianceDeleteResponse
} from '../../../app/types/claim-agreement-alliance';
import { fetchWithCSRF } from '../api';

export const getDataFetch = (token: string): Promise<ClaimAgreementAllianceListResponse> =>
  fetchWithCSRF('/api/claim-agreement-alliance', { method: 'GET' }, token);

export const getData = (token: string, uuid: string): Promise<ClaimAgreementAllianceResponse> =>
  fetchWithCSRF(`/api/claim-agreement-alliance/${uuid}`, { method: 'GET' }, token);

export const createData = (
  token: string,
  data: ClaimAgreementAllianceCreateDTO
): Promise<ClaimAgreementAllianceResponse> =>
  fetchWithCSRF(
    '/api/claim-agreement-alliance/store',
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
  data: ClaimAgreementAllianceUpdateDTO
): Promise<ClaimAgreementAllianceResponse> =>
  fetchWithCSRF(
    `/api/claim-agreement-alliance/update/${uuid}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    token
  );

export const deleteData = (token: string, uuid: string): Promise<ClaimAgreementAllianceDeleteResponse> =>
  fetchWithCSRF(`/api/claim-agreement-alliance/delete/${uuid}`, { method: 'DELETE' }, token);

export const restoreData = (token: string, uuid: string): Promise<ClaimAgreementAllianceResponse> =>
  fetchWithCSRF(`/api/claim-agreement-alliance/restore/${uuid}`, { method: 'PUT' }, token);