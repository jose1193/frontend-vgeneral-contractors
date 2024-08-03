import * as Yup from "yup";

const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .matches(/^[A-Za-z\s]+$/, "Name can only contain letters")
    .max(50, "Name can't be longer than 50 characters"),
  last_name: Yup.string()
    .required("Last name is required")
    .matches(/^[A-Za-z\s]+$/, "Last name can only contain letters")
    .max(50, "Last name can't be longer than 50 characters"),
  username: Yup.string()
    .required("Username is required")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .max(30, "Username can't be longer than 30 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address")
    .max(255, "Email can't be longer than 255 characters"),
  phone: Yup.string()
    .nullable()
    .matches(phoneRegExp, "Phone number is not valid")
    .max(20, "Phone number can't be longer than 20 characters"),
  zip_code: Yup.string()
    .nullable()
    .max(10, "Zip code can't be longer than 10 characters"),
  address: Yup.string()
    .nullable()
    .max(255, "Address can't be longer than 255 characters"),
  city: Yup.string()
    .nullable()
    .matches(/^[A-Za-z\s]+$/, "City can only contain letters")
    .max(30, "City can't be longer than 30 characters"),
  country: Yup.string()
    .nullable()
    .matches(/^[A-Za-z\s]+$/, "Country can only contain letters")
    .max(30, "Country can't be longer than 30 characters"),
  user_role: Yup.string().required("User role is required"),
  uuid: Yup.string().nullable(),
  profile_photo_path: Yup.string().nullable(),
  created_at: Yup.string().nullable(),
  update_at: Yup.string().nullable(),
  delete_at: Yup.string().nullable(),
});
