import { promises as fs } from "fs";
import path from "path";
import { GeneratorConfig } from "../types";
import { toKebabCase, ensureDirectoryExists } from "../utils";

export async function generateActions(config: GeneratorConfig) {
  const { name, baseDir } = config;
  const dir = path.join(baseDir, "app/lib/actions");
  await ensureDirectoryExists(dir);

  // Convertir el nombre para el archivo (ejemplo: claimAgreementFullActions.ts)
  const fileName = `${name.charAt(0).toLowerCase()}${name.slice(1)}Actions.ts`;

  const content = `import {
  ${name}Data,
  ${name}CreateDTO,
  ${name}UpdateDTO,
  ${name}GetResponse,
  ${name}ListResponse,
  ${name}DeleteResponse,
  ${name}CreateResponse,
  ${name}UpdateResponse,
  ${name}RestoreResponse
} from '../../../app/types/${toKebabCase(name)}';
import { fetchWithCSRF } from '../api';

export const getDataFetch = (token: string): Promise<${name}ListResponse> =>
  fetchWithCSRF('/api/${toKebabCase(name)}', { method: 'GET' }, token);

export const getData = (token: string, uuid: string): Promise<${name}GetResponse> =>
  fetchWithCSRF(\`/api/${toKebabCase(
    name
  )}/\${uuid}\`, { method: 'GET' }, token);

export const createData = (
  token: string,
  data: ${name}CreateDTO
): Promise<${name}CreateResponse> =>
  fetchWithCSRF(
    '/api/${toKebabCase(name)}/store',
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
  data: ${name}UpdateDTO
): Promise<${name}UpdateResponse> =>
  fetchWithCSRF(
    \`/api/${toKebabCase(name)}/update/\${uuid}\`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    token
  );

export const deleteData = (token: string, uuid: string): Promise<${name}DeleteResponse> =>
  fetchWithCSRF(\`/api/${toKebabCase(
    name
  )}/delete/\${uuid}\`, { method: 'DELETE' }, token);

export const restoreData = (token: string, uuid: string): Promise<${name}RestoreResponse> =>
  fetchWithCSRF(\`/api/${toKebabCase(
    name
  )}/restore/\${uuid}\`, { method: 'PUT' }, token);`;

  await fs.writeFile(path.join(dir, fileName), content);
}
