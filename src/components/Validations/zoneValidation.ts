// components/Validations/zoneValidation.ts

import * as yup from "yup";
import { ZoneData } from "../../../app/types/zone";

export const zoneSchema = yup.object().shape({
  zone_name: yup
    .string()
    .required("Zone name is required")
    .max(255, "Zone name must be less than 255 characters"),
  zone_type: yup
    .string()
    .oneOf(["interior", "exterior"] as const, "Invalid zone type")
    .default("interior")
    .required("Zone type is required"),
  code: yup
    .string()
    .nullable()
    .matches(
      /^[a-zA-Z0-9-]*$/,
      "Code can only contain letters, numbers, and hyphens"
    )
    .max(255, "Code must be less than 255 characters")
    .transform((value) => (value === "" ? null : value)),
  description: yup
    .string()
    .nullable()
    .max(1000, "Description must be less than 1000 characters")
    .transform((value) => (value === "" ? null : value)),
}) as yup.ObjectSchema<ZoneData>;
