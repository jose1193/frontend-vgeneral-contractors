import * as yup from "yup";
import {
  TEMPLATE_TYPES,
  SUPPORTED_FORMATS,
  MAX_FILE_SIZE,
  TemplateType,
  DocumentTemplateFormData,
} from "../../../app/types/document-template";

export const documentTemplateValidation = yup.object().shape({
  template_name: yup
    .string()
    .required("Template name is required")
    .max(255, "Template name must be at most 255 characters"),

  template_description: yup
    .string()
    .nullable()
    .max(1000, "Description must be at most 1000 characters"),

  template_type: yup
    .mixed<TemplateType>()
    .required("Template type is required")
    .oneOf(TEMPLATE_TYPES, "Invalid template type"),

  template_path: yup
    .mixed()
    .test("fileValidation", "Invalid file", function (value) {
      // Si hay initialData o template_path existente, es una actualización
      const isUpdate =
        this.parent.id !== undefined || typeof value === "string";

      // Para actualizaciones
      if (isUpdate) {
        // Si es una URL o string (path existente), es válido
        if (typeof value === "string") {
          return true;
        }

        // Si no hay nuevo archivo, es válido
        if (!value) {
          return true;
        }

        // Si hay un nuevo archivo, validar formato y tamaño
        if (value instanceof File) {
          if (value.size > MAX_FILE_SIZE) {
            return this.createError({
              message: "File is too large (max 15MB)",
            });
          }
          if (!SUPPORTED_FORMATS.includes(value.type as any)) {
            return this.createError({ message: "Unsupported file format" });
          }
          return true;
        }
      }

      // Para nuevas creaciones
      if (!value) {
        return this.createError({ message: "Template file is required" });
      }

      if (value instanceof File) {
        if (value.size > MAX_FILE_SIZE) {
          return this.createError({ message: "File is too large (max 15MB)" });
        }
        if (!SUPPORTED_FORMATS.includes(value.type as any)) {
          return this.createError({ message: "Unsupported file format" });
        }
        return true;
      }

      return false;
    }),
}) as yup.ObjectSchema<DocumentTemplateFormData>;

// Type check to ensure validation schema matches form data type
type ValidatedDocumentTemplateData = yup.InferType<
  typeof documentTemplateValidation
>;
const _typeCheck: ValidatedDocumentTemplateData extends DocumentTemplateFormData
  ? true
  : false = true;
