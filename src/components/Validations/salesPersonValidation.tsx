// src/validations/salesPersonValidation.ts
import * as yup from "yup";

export const salesPersonSchema = yup.object().shape({
  id: yup.number().optional(),
  uuid: yup.string().optional(),
  salesperson_id: yup.number().nullable(),
  signature_path: yup.string().required("Signature path is required"),
  created_at: yup.string().nullable(),
  updated_at: yup.string().nullable(),
});
