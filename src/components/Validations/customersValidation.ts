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
    .required("Cell Phone is required")
    .matches(
      /^\+1\d{10}$/,
      "Cell Phone number must be in US format +1 (XXX)-XXX-XXXX"
    ),
  home_phone: yup
    .string()
    .nullable()
    .test(
      "is-empty-or-valid",
      "Home Phone number must be in US format +1 (XXX)-XXX-XXXX",
      function (value) {
        if (!value || value === "") return true;
        return /^\+1\d{10}$/.test(value);
      }
    ),

  email: yup.string().email("Invalid email").required("Email is required"),
  occupation: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .matches(
      /^[A-Za-z\s]*$/, // Cambiado + por * para permitir string vacío
      "Occupation must contain only letters and spaces"
    ),

  created_at: yup.string().nullable(),
  updated_at: yup.string().nullable(),
  delete_at: yup.string().nullable(),
});
