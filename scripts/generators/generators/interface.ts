// scripts/generators/generators/interface.ts
import { promises as fs } from "fs";
import path from "path";
import { GeneratorConfig } from "../types";
import { toKebabCase, ensureDirectoryExists } from "../utils";

export async function generateInterface(config: GeneratorConfig) {
  const { name, fields, baseDir } = config;

  const content = `import { UserData } from "./user";

export interface ${name}Data {
  id?: number;
  uuid?: string;
  user_id?: UserData;
  ${fields
    .map((field) => `${field.name}${field.required ? "" : "?"}: ${field.type};`)
    .join("\n  ")}
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export type ${name}CreateDTO = Omit<${name}Data, 'id' | 'uuid' | 'created_at' | 'updated_at' | 'deleted_at'>;
export type ${name}UpdateDTO = Partial<${name}CreateDTO>;

export interface ${name}Response {
  success: boolean;
  data: ${name}Data;
  message?: string;
}

export interface ${name}ListResponse {
  success: boolean;
  data: ${name}Data[];
  message?: string;
}

export interface ${name}DeleteResponse {
  success: boolean;
  message?: string;
}

export interface ${name}RestoreResponse {
  success: boolean;
  data: ${name}Data;
  message?: string;
}`;

  const dir = path.join(baseDir, "types");
  await ensureDirectoryExists(dir);
  await fs.writeFile(path.join(dir, `${toKebabCase(name)}.ts`), content);
}
