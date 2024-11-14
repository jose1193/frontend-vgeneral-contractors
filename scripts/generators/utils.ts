// scripts/generators/utils.ts
import { promises as fs } from "fs";
import path from "path";
import { Field, ValidationRule } from "./types";

export function toCamelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, "");
}

export function toPascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
    .replace(/\s+/g, "");
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .replace(/_/g, "-")
    .toLowerCase();
}

export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_")
    .toLowerCase();
}

export function toPlural(str: string): string {
  // Reglas básicas de pluralización en inglés
  if (str.endsWith("y")) {
    return str.slice(0, -1) + "ies";
  }
  if (
    str.endsWith("s") ||
    str.endsWith("x") ||
    str.endsWith("z") ||
    str.endsWith("ch") ||
    str.endsWith("sh")
  ) {
    return str + "es";
  }
  return str + "s";
}

export function toSingular(str: string): string {
  // Reglas básicas de singularización en inglés
  if (str.endsWith("ies")) {
    return str.slice(0, -3) + "y";
  }
  if (str.endsWith("es")) {
    return str.slice(0, -2);
  }
  if (str.endsWith("s")) {
    return str.slice(0, -1);
  }
  return str;
}

export async function ensureDirectoryExists(dir: string) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

export function generateValidationRules(fields: Field[]): ValidationRule[] {
  return fields.map((field) => {
    const rule: ValidationRule = {
      name: field.name,
      type: field.type,
      required: field.required,
      validations: {},
    };

    switch (field.type) {
      case "string":
        rule.validations = {
          min: 2,
          max: 255,
          message: `${toPascalCase(
            field.name
          )} must be between 2 and 255 characters`,
        };
        break;
      case "number":
        rule.validations = {
          min: 0,
          message: `${toPascalCase(field.name)} must be a positive number`,
        };
        break;
      case "email":
        rule.validations = {
          pattern: "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$",
          message: "Please enter a valid email address",
        };
        break;
      case "phone":
        rule.validations = {
          pattern: "^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4}$",
          message: "Please enter a valid phone number",
        };
        break;
      case "url":
        rule.validations = {
          pattern: "^https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$",
          message: "Please enter a valid URL",
        };
        break;
    }

    return rule;
  });
}

export async function getExistingFiles(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

export async function writeFileIfNotExists(filePath: string, content: string) {
  try {
    await fs.access(filePath);
    console.log(`File already exists: ${filePath}`);
  } catch {
    await fs.writeFile(filePath, content);
    console.log(`Created file: ${filePath}`);
  }
}

export function generateComment(text: string): string {
  return `/**
 * ${text}
 */`;
}

export function generateImportStatement(
  imports: string[],
  from: string
): string {
  return `import { ${imports.join(", ")} } from '${from}';`;
}

export function generateExportStatement(
  exports: string[],
  type: "named" | "default" = "named"
): string {
  if (type === "default") {
    return `export default ${exports[0]};`;
  }
  return `export { ${exports.join(", ")} };`;
}

export function formatTypeScript(code: string): string {
  return (
    code
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim() + "\n"
  );
}

export async function createIndexFile(dir: string, exports: string[]) {
  const content =
    exports.map((name) => `export * from './${name}';`).join("\n") + "\n";
  await writeFileIfNotExists(path.join(dir, "index.ts"), content);
}

export function generateFieldValidation(field: Field): string {
  switch (field.type) {
    case "string":
      return `${field.name}: yup.string()${
        field.required ? ".required()" : ".nullable()"
      }`;
    case "number":
      return `${field.name}: yup.number()${
        field.required ? ".required()" : ".nullable()"
      }`;
    case "boolean":
      return `${field.name}: yup.boolean()${
        field.required ? ".required()" : ".nullable()"
      }`;
    case "date":
      return `${field.name}: yup.date()${
        field.required ? ".required()" : ".nullable()"
      }`;
    default:
      return `${field.name}: yup.mixed()${
        field.required ? ".required()" : ".nullable()"
      }`;
  }
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateApiEndpoint(name: string, action: string): string {
  return `/api/${toKebabCase(name)}/${action}`.replace(/\/+/g, "/");
}
