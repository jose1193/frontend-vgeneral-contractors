import * as yup from "yup";

const websiteRegExp = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

export const insuranceCompanyValidation = yup.object().shape({
  insurance_company_name: yup
    .string()
    .required("Insurance company name is required")
    .max(255, "Insurance company name must be at most 255 characters"),
  address: yup
    .string()
    .nullable()
    .matches(
      /^[A-Za-zÀ-ÿ0-9\s.,#-]*$/,
      "Address can contain letters, numbers, spaces and basic punctuation"
    )
    .max(255, "Address can't be longer than 255 characters"),
  phone: yup
    .string()
    .nullable("Phone is required")
    .matches(
      /^\+1\d{10}$/,
      "Phone number must be in US format +1 (XXX)-XXX-XXXX"
    ),
  email: yup.string().optional().nullable().email("Invalid email format"),
  website: yup
    .string()
    .optional()
    .nullable()
    .matches(websiteRegExp, "Website must be in the format www.company.com"),
  prohibited_alliances: yup.array().nullable(),
  created_at: yup.string().nullable(),
  updated_at: yup.string().nullable(),
});
