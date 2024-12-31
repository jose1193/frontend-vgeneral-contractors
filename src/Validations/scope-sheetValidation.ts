import * as yup from "yup";

export const ScopeSheetValidation = yup.object().shape({
  uuid: yup.string().nullable().min(2, "uuid must be at least 2 characters")
    .max(255, "uuid must be less than 255 characters"),
  claim_id: yup.number().nullable().min(0, "claim_id must be a positive number"),
  scope_sheet_description: yup.string().nullable().min(2, "scope_sheet_description must be at least 2 characters")
    .max(255, "scope_sheet_description must be less than 255 characters"),
  generated_by: yup.number().nullable().min(0, "generated_by must be a positive number")
});

export type ScopeSheetValidationSchema = yup.InferType<typeof ScopeSheetValidation>;