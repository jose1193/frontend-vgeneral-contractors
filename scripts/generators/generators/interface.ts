import { promises as fs } from "fs";
import path from "path";
import { GeneratorConfig } from "../types";
import { toKebabCase, ensureDirectoryExists } from "../utils";

export async function generateInterface(config: GeneratorConfig) {
  const { name, fields, baseDir } = config;
  const dir = path.join(baseDir, "app/types");
  await ensureDirectoryExists(dir);

  // Collect imports needed for object types
  const imports = new Set<string>();
  imports.add('import { UserData } from "./user";');

  // Process fields to add necessary imports
  fields.forEach((field) => {
    if (field.type === "object") {
      const typeName = field.name.charAt(0).toUpperCase() + field.name.slice(1);
      imports.add(
        `import { ${typeName}Data } from "./${toKebabCase(field.name)}";`
      );
    }
  });

  const content = `${Array.from(imports).join("\n")}

export interface ${name}Data {
  id?: number;
  uuid?: string;
  user_id?: UserData;
  ${fields
    .map((field) => {
      // If field type is object, use the corresponding interface
      if (field.type === "object") {
        const typeName =
          field.name.charAt(0).toUpperCase() + field.name.slice(1);
        return `${field.name}${field.required ? "" : "?"}: ${typeName}Data;`;
      }
      return `${field.name}${field.required ? "" : "?"}: ${field.type};`;
    })
    .join("\n  ")}
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  generated_by?: string;
}

export type ${name}CreateDTO = Omit<
  ${name}Data,
  "id" | "uuid" | "created_at" | "updated_at" | "deleted_at"
>;

export type ${name}UpdateDTO = Partial<${name}CreateDTO>;

// Response types for get and list with success/data format
export interface ${name}ListResponse {
  success: boolean;
  data: ${name}Data[];
  message?: string;
}


// Response type for delete with only success/message
export interface ${name}DeleteResponse {
  success: boolean;
  message?: string;
}

// Create, update and restore return the object directly
export type ${name}CreateResponse = ${name}Data;
export type ${name}UpdateResponse = ${name}Data;
export type ${name}GetResponse = ${name}Data;
export type ${name}RestoreResponse = ${name}Data;`;

  await fs.writeFile(path.join(dir, `${toKebabCase(name)}.ts`), content);
}
