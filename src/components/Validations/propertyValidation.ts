import * as yup from "yup";

export const propertySchema = yup.object().shape({
  property_address: yup.string().required("Property address is required"),
  property_address_2: yup.string().nullable(),
  property_state: yup.string().nullable(),
  property_city: yup.string().nullable(),
  property_postal_code: yup.string().nullable(),
  property_country: yup.string().nullable(),
  property_latitude: yup
    .number()
    .nullable()
    .min(-90, "Latitude must be at least -90")
    .max(90, "Latitude must be at most 90"),
  property_longitude: yup
    .number()
    .nullable()
    .min(-180, "Longitude must be at least -180")
    .max(180, "Longitude must be at most 180"),
  created_at: yup.string().nullable(),
  updated_at: yup.string().nullable(),
  customer_array_id: yup
    .array()
    .of(yup.number().required("Each customer ID must be a number"))
    .required("Customer array is required"),
});
