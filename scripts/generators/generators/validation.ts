// scripts/generators/generators/validation.ts
import { promises as fs } from "fs";
import path from "path";
import { GeneratorConfig } from "../types";
import { toKebabCase, ensureDirectoryExists } from "../utils";

export async function generateValidation(config: GeneratorConfig) {
  const { name, fields, baseDir } = config;

  const validationContent = `import * as yup from "yup";

export const ${name}Validation = yup.object().shape({
  ${fields
    .map((field) => {
      let validation = `${field.name}: yup.${field.type}()`;

      if (field.required) {
        validation += `.required("${field.name} is required")`;
      } else {
        validation += `.nullable()`;
      }

      switch (field.type) {
        case "string":
          validation += `.min(2, "${field.name} must be at least 2 characters")
    .max(255, "${field.name} must be less than 255 characters")`;
          break;
        case "number":
          validation += `.min(0, "${field.name} must be a positive number")`;
          break;
        case "email":
          validation += `.email("Invalid email format")`;
          break;
      }

      return validation;
    })
    .join(",\n  ")}
});

export type ${name}ValidationSchema = yup.InferType<typeof ${name}Validation>;
`;

  const dir = path.join(baseDir, "lib/validations");
  await ensureDirectoryExists(dir);
  await fs.writeFile(
    path.join(dir, `${toKebabCase(name)}Validation.ts`),
    validationContent
  );
}
