import * as yup from "yup";
import {
  TEMPLATE_TYPES_ALLIANCE,
  SUPPORTED_FORMATS_ALLIANCE,
  MAX_FILE_SIZE_ALLIANCE,
  TemplateTypeAlliance,
  DocumentTemplateAllianceFormData,
} from "../../../app/types/document-template-alliance";

export const documentTemplateAllianceValidation = yup.object().shape({
  template_name_alliance: yup
    .string()
    .required("Template name is required")
    .max(255, "Template name must be at most 255 characters"),

  template_description_alliance: yup
    .string()
    .nullable()
    .max(1000, "Description must be at most 1000 characters"),

  template_type_alliance: yup
    .mixed<TemplateTypeAlliance>()
    .required("Template type is required")
    .oneOf(TEMPLATE_TYPES_ALLIANCE, "Invalid template type"),

  template_path_alliance: yup
    .mixed()
    .test("fileValidation", "Invalid file", function (value) {
      // Si no hay valor y es una actualización (hay initialData), es válido
      if (!value && this.parent.id) {
        return true;
      }

      // Si no hay valor y es creación nueva, es inválido
      if (!value && !this.parent.id) {
        return this.createError({ message: "Template file is required" });
      }

      // Si hay un valor, debe ser un archivo válido
      if (value instanceof File) {
        // Validar tamaño
        if (value.size > MAX_FILE_SIZE_ALLIANCE) {
          return this.createError({ message: "File is too large (max 15MB)" });
        }

        // Validar formato
        if (!SUPPORTED_FORMATS_ALLIANCE.includes(value.type as any)) {
          return this.createError({ message: "Unsupported file format" });
        }

        return true;
      }

      // Si hay un valor pero no es un archivo
      return value === null || value === undefined;
    }),

  alliance_company_id: yup
    .number()
    .required("Alliance company ID is required")
    .integer("Must be a valid integer"),

  signature_path_id: yup.number().nullable().integer("Must be a valid integer"),
}) as yup.ObjectSchema<DocumentTemplateAllianceFormData>;

// Type check to ensure validation schema matches form data type
type ValidatedDocumentTemplateAllianceData = yup.InferType<
  typeof documentTemplateAllianceValidation
>;
const _typeCheck: ValidatedDocumentTemplateAllianceData extends DocumentTemplateAllianceFormData
  ? true
  : false = true;
