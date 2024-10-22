import * as yup from "yup";

const websiteRegExp = /^www\.[a-zA-Z0-9-]+\.com$/;

export const publicCompanyValidation = yup.object().shape({
  public_company_name: yup
    .string()
    .required("Public company name is required")
    .max(255, "Public company name must be at most 255 characters"),

  address: yup.string().nullable(),

  phone: yup
    .string()
    .nullable("Phone is required")
    .matches(
      /^\+1\d{10}$/,
      "Phone number must be in US format +1 (XXX)-XXX-XXXX"
    ),

  email: yup.string().nullable().email("Invalid email format"),

  website: yup
    .string()
    .nullable()
    .matches(websiteRegExp, "Website must be in the format www.company.com"),

  created_at: yup.string().nullable(),

  updated_at: yup.string().nullable(),
});
