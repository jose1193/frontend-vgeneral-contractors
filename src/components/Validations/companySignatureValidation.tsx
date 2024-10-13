// src/validations/companySignatureValidation.ts
import * as yup from "yup";
const websiteRegExp = /^www\.[a-zA-Z0-9-]+\.com$/;
export const companySignatureValidation = yup.object().shape({
  id: yup.number().optional(),
  uuid: yup.string().optional(),
  company_name: yup.string().required("Company Name is required"),
  phone: yup
    .string()
    .nullable()
    .matches(/^\d{11}$/, "Phone number must be in US format (XXX)-XXX-XXXX"),
  email: yup.string().required().email("Invalid email"),
  website: yup
    .string()
    .nullable()
    .matches(websiteRegExp, "Website must be in the format www.company.com"),
  latitude: yup
    .number()
    .nullable()
    .min(-90, "Latitude must be at least -90")
    .max(90, "Latitude must be at most 90"),
  longitude: yup
    .number()
    .nullable()
    .min(-180, "Longitude must be at least -180")
    .max(180, "Longitude must be at most 180"),
  address: yup.string().required(),
  signature_path: yup.string().required("Signature Path is required"),
  created_at: yup.string().nullable(),
  updated_at: yup.string().nullable(),
});
