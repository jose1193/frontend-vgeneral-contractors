import * as yup from "yup";
import {
  SUPPORTED_FORMATS,
  MAX_FILE_SIZE,
  TemplateTypeAdjuster,
  TEMPLATE_TYPES_ADJUSTER,
  DocumentTemplateAdjusterData,
} from "../../../app/types/document-template-adjuster";

// Custom test to check if value is a File
const isFile = (value: any): value is File => {
  return value instanceof File;
};

export const documentTemplateAdjusterValidation = yup.object().shape({
  // Optional fields
  id: yup.number().optional(),
  uuid: yup.string().nullable(),
  uploaded_by: yup.number().optional(),
  created_at: yup.string().optional(),
  updated_at: yup.string().optional(),
  adjuster: yup.string().optional(),

  // Required fields with proper null handling
  template_description_adjuster: yup
    .string()
    .nullable()
    .required("Description is required")
    .min(3, "Description must be at least 3 characters")
    .max(255, "Description must not exceed 255 characters"),

  template_type_adjuster: yup
    .string()
    .nullable()
    .required("Template type is required")
    .oneOf(
      TEMPLATE_TYPES_ADJUSTER,
      "Invalid template type"
    ) as yup.StringSchema<TemplateTypeAdjuster>,

  public_adjuster_id: yup
    .number()
    .nullable()
    .required("Public adjuster is required"),

  template_path_adjuster: yup
    .mixed<File>()
    .nullable()
    .test("required", "File is required", (value) => {
      if (!value && !yup.ref("id")) {
        return false;
      }
      return true;
    })
    .test("fileSize", "File is too large (max 15MB)", (value) => {
      if (!value || !isFile(value)) return true;
      return value.size <= MAX_FILE_SIZE;
    })
    .test("fileFormat", "Unsupported file format", (value) => {
      if (!value || !isFile(value)) return true;
      return SUPPORTED_FORMATS.includes(
        value.type as (typeof SUPPORTED_FORMATS)[number]
      );
    }),
}) as yup.ObjectSchema<DocumentTemplateAdjusterData>;

// Type assertion to ensure schema matches DocumentTemplateAdjusterData
type ValidationSchemaType = yup.InferType<
  typeof documentTemplateAdjusterValidation
>;
const _typeCheck: DocumentTemplateAdjusterData = {} as ValidationSchemaType;

// Helper functions
export const validateFile = async (file: File): Promise<string | null> => {
  try {
    await yup
      .mixed<File>()
      .test("fileSize", "File is too large (max 15MB)", (value) => {
        return value instanceof File && value.size <= MAX_FILE_SIZE;
      })
      .test("fileFormat", "Unsupported file format", (value) => {
        return (
          value instanceof File &&
          SUPPORTED_FORMATS.includes(
            value.type as (typeof SUPPORTED_FORMATS)[number]
          )
        );
      })
      .validate(file);

    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return "An error occurred while validating the file";
  }
};

export const formatValidationErrors = (
  error: yup.ValidationError
): Record<string, string[]> => {
  return error.inner.reduce((acc, err) => {
    if (!err.path) return acc;

    if (!acc[err.path]) {
      acc[err.path] = [];
    }

    if (err.message) {
      acc[err.path].push(err.message);
    }

    return acc;
  }, {} as Record<string, string[]>);
};
