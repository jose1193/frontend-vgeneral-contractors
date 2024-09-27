// src/validations/companySignatureValidation.ts
import * as yup from "yup";

export const companySignatureValidation = yup.object().shape({
  id: yup.number().optional(),
  uuid: yup.string().optional(),
  company_name: yup.string().required("Company Name is required"),
  phone: yup.string().required().max(20, "Phone must be at most 20 characters"),
  email: yup.string().required().email("Invalid email"),
  website: yup.string().nullable().url("Invalid URL"),
  address: yup.string().required(),
  signature_path: yup.string().required("Signature Path is required"),
  created_at: yup.string().nullable(),
  updated_at: yup.string().nullable(),
});
