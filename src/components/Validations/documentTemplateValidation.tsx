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
    .nullable("Template file is required")
    .test("isFile", "A valid file is required", (value) => {
      return value instanceof File;
    })
    .test("fileSize", "File is too large (max 15MB)", (value) => {
      return value instanceof File ? value.size <= MAX_FILE_SIZE : false;
    })
    .test("fileFormat", "Unsupported file format", (value) => {
      return value instanceof File
        ? SUPPORTED_FORMATS.includes(
            value.type as (typeof SUPPORTED_FORMATS)[number]
          )
        : false;
    }),
}) as yup.ObjectSchema<DocumentTemplateFormData>;

// Type check to ensure validation schema matches form data type
type ValidatedDocumentTemplateData = yup.InferType<
  typeof documentTemplateValidation
>;
const _typeCheck: ValidatedDocumentTemplateData extends DocumentTemplateFormData
  ? true
  : false = true;
