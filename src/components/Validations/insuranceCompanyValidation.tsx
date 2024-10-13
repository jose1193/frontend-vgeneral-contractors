import * as yup from "yup";

const websiteRegExp = /^www\.[a-zA-Z0-9-]+\.com$/;

export const insuranceCompanyValidation = yup.object().shape({
  insurance_company_name: yup
    .string()
    .required("Insurance company name is required")
    .max(255, "Insurance company name must be at most 255 characters"),
  address: yup.string().nullable(),
  phone: yup
    .string()
    .nullable()
    .matches(/^\d{11}$/, "Phone number must be in US format +1 (XXX)-XXX-XXXX"),
  email: yup.string().nullable().email("Invalid email format"),
  website: yup
    .string()
    .nullable()
    .matches(websiteRegExp, "Website must be in the format www.company.com"),
  prohibited_alliances: yup.array().nullable(),
  created_at: yup.string().nullable(),
  updated_at: yup.string().nullable(),
});
