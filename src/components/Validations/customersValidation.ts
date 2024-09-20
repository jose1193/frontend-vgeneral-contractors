// src/validations/customerValidation.ts
import * as yup from "yup";

export const customerSchema = yup.object().shape({
  id: yup.number().optional(),
  name: yup.string().required("Name is required"),
  last_name: yup.string().required("Last name is required"),
  cell_phone: yup
    .string()
    .nullable()
    .max(20, "Cell phone must be at most 20 characters"),
  home_phone: yup
    .string()
    .nullable()
    .max(20, "Home phone must be at most 20 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  occupation: yup
    .string()
    .nullable()
    .matches(
      /^[A-Za-z\s]+$/,
      "Occupation must contain only letters and spaces"
    ),

  created_at: yup.string().nullable(),
  update_at: yup.string().nullable(),
  delete_at: yup.string().nullable(),
});
