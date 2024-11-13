import * as yup from "yup";
import {
  DocumentTemplateAllianceData,
  TEMPLATE_TYPES_ALLIANCE,
  SUPPORTED_FORMATS_ALLIANCE,
  MAX_FILE_SIZE_ALLIANCE,
  TemplateTypeAlliance,
} from "../../../app/types/document-template-alliance";

export const documentTemplateAllianceValidation = yup.object().shape({
  uuid: yup.string().nullable(),

  template_name_alliance: yup
    .string()
    .required("Template name is required")
    .max(255, "Template name must be at most 255 characters"),

  template_description_alliance: yup
    .string()
    .nullable()
    .max(1000, "Description must be at most 1000 characters"),

  template_type_alliance: yup
    .string()
    .required("Template type is required")
    .oneOf(
      TEMPLATE_TYPES_ALLIANCE,
      "Invalid template type"
    ) as yup.StringSchema<TemplateTypeAlliance>,

  template_path_alliance: yup
    .mixed()
    .nullable()
    .test("fileValidation", "Invalid file", function (value) {
      // Si hay una URL existente, el archivo no es requerido
      if (this.parent.template_path_alliance_url) return true;

      // Si es una actualización (hay ID) y no hay nuevo archivo, es válido
      if (!value && this.parent.id) return true;

      // Para nuevos templates, requerir archivo
      if (!value && !this.parent.id) {
        return this.createError({ message: "Template file is required" });
      }

      // Validar propiedades del archivo si existe
      if (value instanceof File) {
        if (value.size > MAX_FILE_SIZE_ALLIANCE) {
          return this.createError({ message: "File is too large (max 15MB)" });
        }

        if (!SUPPORTED_FORMATS_ALLIANCE.includes(value.type as any)) {
          return this.createError({ message: "Unsupported file format" });
        }

        return true;
      }

      return value === null;
    }),

  // Agregar validación para la URL del archivo
  template_path_alliance_url: yup.string().nullable(),

  alliance_company_id: yup
    .number()
    .required("Alliance company ID is required")
    .integer("Must be a valid integer"),

  signature_path_id: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .integer("Must be a valid integer"),

  alliance_companies: yup.array().optional(),
  alliance_company_name: yup.string().optional(),
  created_at: yup.string().optional(),
  updated_at: yup.string().optional(),
  uploaded_by: yup.number().optional(),
  id: yup.number().optional(),
}) as yup.ObjectSchema<DocumentTemplateAllianceData>;

// Type assertion to ensure schema matches interface
type ValidatedType = yup.InferType<typeof documentTemplateAllianceValidation>;
const _typeCheck: ValidatedType extends DocumentTemplateAllianceData
  ? true
  : false = true;

export type { ValidatedType as ValidatedDocumentTemplateAllianceData };
