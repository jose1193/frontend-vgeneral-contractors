import * as yup from "yup";

export const propertySchema = yup.object().shape({
  property_address: yup.string().required("Property address is required"),
  property_state: yup.string().required("Property state is required"),
  property_city: yup.string().required("Property city is required"),
  property_postal_code: yup
    .string()
    .required("Property postal code is required"),
  property_country: yup.string().required("Property country is required"),
  customer_id: yup
    .array()
    .of(yup.number().required())
    .min(1, "At least one customer must be selected")
    .required("Customers are required"),
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
});
