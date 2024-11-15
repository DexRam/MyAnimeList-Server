import { User } from "../interfaces";

export const register = async ({ email, username, password }: User) => {
  try {
    return "The user had been successfully registered";
  } catch (error) {
    console.error("Error while changing the anime status:", error);
    throw error;
  }
};

export const login = ({ email, password }: User) => {
  try {
    return "The user had been successfully authentificated";
  } catch (error) {
    console.error("Error while authentificating the user:", error);
    throw error;
  }
};
