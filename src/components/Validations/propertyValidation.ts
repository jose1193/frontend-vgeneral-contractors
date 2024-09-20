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
  created_at: yup.string().nullable(),
  updated_at: yup.string().nullable(),
});
