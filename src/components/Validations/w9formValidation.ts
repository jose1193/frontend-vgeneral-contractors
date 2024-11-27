import * as yup from "yup";
import type { W9FormData } from "../../../app/types/w9form";

// Base validation constants
const STRING_MIN_LENGTH = 2;
const STRING_MAX_LENGTH = 255;

// Regex patterns for SSN and EIN
const SSN_PATTERN = /^\d{3}-\d{2}-\d{4}$/;
const EIN_PATTERN = /^\d{2}-\d{7}$/;

// Validation schema that exactly matches W9FormData interface
export const W9FormValidation = yup.object().shape({
  // Optional database fields
  id: yup.number().optional(),
  uuid: yup.string().optional(),
  created_at: yup.string().optional().nullable(),
  updated_at: yup.string().optional().nullable(),
  deleted_at: yup.string().optional().nullable(),

  // Required fields
  name: yup
    .string()
    .required("Name is required")
    .min(STRING_MIN_LENGTH, "Name must be at least 2 characters")
    .max(STRING_MAX_LENGTH, "Name must be less than 255 characters"),

  // Optional fields with proper typing
  business_name: yup.string().optional(),

  // Boolean fields
  is_individual_sole_proprietor: yup.boolean().optional(),
  is_corporation: yup.boolean().optional(),
  is_partnership: yup.boolean().optional(),
  is_limited_liability_company: yup.boolean().optional(),
  is_exempt_payee: yup.boolean().optional(),
  is_other: yup.boolean().optional(),

  // Optional string fields
  llc_tax_classification: yup.string().optional(),

  // Required address fields
  address: yup
    .string()
    .required("Address is required")
    .min(STRING_MIN_LENGTH, "Address must be at least 2 characters")
    .max(STRING_MAX_LENGTH, "Address must be less than 255 characters"),
  address_2: yup.string().optional(),
  city: yup
    .string()
    .required("City is required")
    .min(STRING_MIN_LENGTH, "City must be at least 2 characters")
    .max(STRING_MAX_LENGTH, "City must be less than 255 characters"),
  state: yup
    .string()
    .required("State is required")
    .min(STRING_MIN_LENGTH, "State must be at least 2 characters")
    .max(STRING_MAX_LENGTH, "State must be less than 255 characters"),
  zip_code: yup
    .string()
    .required("ZIP code is required")
    .min(STRING_MIN_LENGTH, "ZIP code must be at least 2 characters")
    .max(STRING_MAX_LENGTH, "ZIP code must be less than 255 characters"),
  country: yup
    .string()
    .required("Country is required")
    .min(STRING_MIN_LENGTH, "Country must be at least 2 characters")
    .max(STRING_MAX_LENGTH, "Country must be less than 255 characters"),

  // Optional number fields
  latitude: yup.number().optional(),
  longitude: yup.number().optional(),

  // Optional string fields
  requester_name_address: yup.string().optional(),
  account_numbers: yup.string().optional(),

  // Required SSN field
  social_security_number: yup
    .string()
    .required("Social security number is required")
    .matches(
      SSN_PATTERN,
      "Social security number must be in format 000-00-0000"
    )
    .max(
      STRING_MAX_LENGTH,
      "Social security number must be less than 255 characters"
    ),

  // Optional fields
  employer_identification_number: yup
    .string()
    .optional()
    .matches(
      EIN_PATTERN,
      "Employer identification number must be in format 00-0000000"
    ),
  certification_signed: yup.boolean().optional(),
  signature_date: yup.string().optional(),

  // Required status field
  status: yup
    .string()
    .required("Status is required")
    .min(STRING_MIN_LENGTH, "Status must be at least 2 characters")
    .max(STRING_MAX_LENGTH, "Status must be less than 255 characters"),

  // Optional fields
  notes: yup.string().optional(),
  document_path: yup.string().optional(),
  generated_by: yup.string().optional(),
});

// Type assertion to ensure schema matches W9FormData interface
export type W9FormValidationType = yup.InferType<typeof W9FormValidation>;
