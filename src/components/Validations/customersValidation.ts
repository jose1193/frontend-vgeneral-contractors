// src/validations/customerValidation.ts
import * as yup from "yup";

export const customerSchema = yup.object().shape({
  id: yup.number().optional(),
  name: yup
    .string()
    .matches(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      "Name should only contain letters, spaces, apostrophes, and hyphens"
    )
    .required("Name is required"),

  last_name: yup
    .string()
    .matches(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      "Last name should only contain letters, spaces, apostrophes, and hyphens"
    )
    .required("Last name is required"),
  cell_phone: yup
    .string()
    .required()
    .matches(
      /^\d{11}$/,
      "Cell Phone number must be in US format (XXX)-XXX-XXXX"
    ),
  home_phone: yup
    .string()
    .nullable()
    .matches(
      /^\d{11}$/,
      "Cell Phone number must be in US format (XXX)-XXX-XXXX"
    ),

  email: yup.string().email("Invalid email").required("Email is required"),
  occupation: yup
    .string()
    .nullable()
    .matches(
      /^[A-Za-z\s]+$/,
      "Occupation must contain only letters and spaces"
    ),

  created_at: yup.string().nullable(),
  updated_at: yup.string().nullable(),
  delete_at: yup.string().nullable(),
});
