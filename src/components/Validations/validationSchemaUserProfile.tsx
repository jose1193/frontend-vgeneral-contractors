import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .matches(/^[A-Za-z\s]+$/, "Name can only contain letters")
    .max(50, "Name can't be longer than 50 characters"),

  last_name: Yup.string()
    .nullable()
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
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Email must be a Gmail address")
    .max(255, "Email can't be longer than 255 characters"),

  phone: Yup.string()
    .nullable()
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      "Please enter a valid international phone number (E.164 format)"
    ),

  zip_code: Yup.string()
    .nullable()
    .max(10, "Zip code can't be longer than 10 characters"),

  address: Yup.string()
    .nullable()
    .matches(
      /^[A-Za-zÀ-ÿ0-9\s.,#-]*$/,
      "Address can contain letters, numbers, spaces and basic punctuation"
    )
    .max(255, "Address can't be longer than 255 characters"),

  address_2: Yup.string()
    .nullable()
    .matches(
      /^[A-Za-zÀ-ÿ0-9\s.,#-]*$/,
      "Address can contain letters, numbers, spaces and basic punctuation"
    )
    .max(255, "Address 2 can't be longer than 255 characters"),

  city: Yup.string()
    .nullable()
    .matches(
      /^[A-Za-zÀ-ÿ\s-]+$/,
      "City can contain letters, spaces and hyphens"
    )
    .max(30, "City can't be longer than 30 characters"),

  state: Yup.string()
    .nullable()
    .matches(
      /^[A-Za-zÀ-ÿ\s-]+$/,
      "State can contain letters, spaces and hyphens"
    )
    .max(30, "State can't be longer than 30 characters"),

  country: Yup.string()
    .nullable()
    .matches(
      /^[A-Za-zÀ-ÿ\s-]+$/,
      "Country can contain letters, spaces and hyphens"
    )
    .max(30, "Country can't be longer than 30 characters"),

  latitude: Yup.number()
    .nullable()
    .min(-90, "Latitude must be at least -90")
    .max(90, "Latitude must be at most 90"),

  longitude: Yup.number()
    .nullable()
    .min(-180, "Longitude must be at least -180")
    .max(180, "Longitude must be at most 180"),

  user_role: Yup.string().required("User role is required"),
  uuid: Yup.string().nullable(),
  profile_photo_path: Yup.string().nullable(),
  created_at: Yup.string().nullable(),
  updated_at: Yup.string().nullable(),
  delete_at: Yup.string().nullable(),
});
