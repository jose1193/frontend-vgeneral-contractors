import * as yup from "yup";

const websiteRegExp = /^www\.[a-zA-Z0-9-]+\.com$/;

export const insuranceCompanyValidation = yup.object().shape({
  insurance_company_name: yup
    .string()
    .required("Insurance company name is required")
    .max(255, "Insurance company name must be at most 255 characters"),
  address: yup.string().nullable(),
  phone: yup.string().nullable().max(20, "Phone must be at most 20 characters"),
  email: yup.string().nullable().email("Invalid email format"),
  website: yup
    .string()
    .nullable()
    .matches(websiteRegExp, "Website must be in the format www.company.com"),
  prohibited_alliances: yup
    .array()
    .of(yup.number().integer().positive())
    .nullable()
    .test(
      "min",
      "At least one prohibited alliance must be selected",
      (value) => !value || value.length > 0
    ),
  created_at: yup.string().nullable(),
  updated_at: yup.string().nullable(),
});
