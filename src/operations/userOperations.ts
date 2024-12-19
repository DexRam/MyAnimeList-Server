import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../interfaces";
import db from "../dbConnector/settings";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || "default-secret-key";
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in the environment variables");
}

export const register = async ({ email, username, password }: User) => {
  try {
    if (await db("users").where("email", email).first()) {
      return "This email is already used";
    } else if (await db("users").where("username", username).first()) {
      return "This username is already used";
    } else {
      await db("users").insert({
        email: email,
        username: username,
        password: await bcrypt.hash(password, 10),
      });
    }
    return "User was Successfully created";
  } catch (error) {
    console.error("Error while registering the user:", error);
    throw error;
  }
};

export const login = async ({ email, password }: User) => {
  try {
    const user = await db("users").where("email", email).first();
    if (!user) {
      return { message: "Invalid email or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { message: "Invalid email or password" };
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "24h",
    });
    return { message: "Login successful", token };
  } catch (error) {
    console.error("Error while authenticating the user:", error);
    throw error;
  }
};
