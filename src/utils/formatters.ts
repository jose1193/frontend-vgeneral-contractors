import { UserData } from "../../app/types/user";

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

export const capitalizeWords = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const generateUsername = (
  firstName: string,
  lastName: string
): string => {
  if (!firstName) return "";
  const cleanFirstName = firstName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanLastName = lastName?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
  let baseUsername = cleanFirstName;
  if (cleanLastName) {
    baseUsername += cleanLastName.charAt(0);
  }
  const randomNum = Math.floor(1 + Math.random() * 999);
  return `${baseUsername}${randomNum}`;
};

export const handleNameChange = (
  value: string,
  user: UserData,
  usernameModifiedManually: boolean,
  setGeneratedUsername: (username: string) => void,
  setFieldValue: (field: string, value: any) => void
) => {
  const capitalizedName = capitalizeWords(value);
  setFieldValue("name", capitalizedName);

  if (!usernameModifiedManually) {
    const lastName = user?.last_name || "";
    const newUsername = generateUsername(capitalizedName, lastName);
    setGeneratedUsername(newUsername);
    setFieldValue("username", newUsername);
  }
};

export const handleLastNameChange = (
  value: string,
  user: UserData,
  usernameModifiedManually: boolean,
  setGeneratedUsername: (username: string) => void,
  setFieldValue: (field: string, value: any) => void
) => {
  const capitalizedLastName = capitalizeWords(value);
  setFieldValue("last_name", capitalizedLastName);

  if (!usernameModifiedManually) {
    const firstName = user?.name || "";
    const newUsername = generateUsername(firstName, capitalizedLastName);
    setGeneratedUsername(newUsername);
    setFieldValue("username", newUsername);
  }
};

export const capitalizeForm = (value: string | null): string => {
  if (!value) return "";
  return value
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const upperCaseForm = (value: string | null): string => {
  if (!value) return "";
  return value.toUpperCase();
};
