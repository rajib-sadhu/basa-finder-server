import { Request, Response } from "express";
import User from "../user/user.model";
import { IUser } from "../user/user.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (payload: IUser) => {
  const user = await User.findOne({ email: payload.email });

  if (user) {
    throw new Error("This email already registered");
  }

  const result = await User.create(payload);
  return result;
};

const login = async (payload: { email: string; password: string }) => {
  // checking if the user exists
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw new Error("This user is not found!");
  }

  // checking if the password is correct
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Wrong Password!!! Tell me who are you? 😈");
  }

  // create token
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, "secret", { expiresIn: "2d" });

  // convert mongoose document to plain object and remove password
  const userWithoutPassword = user.toObject();
  userWithoutPassword.password = "";

  return {
    token,
    user: userWithoutPassword,
  };
};
export const AuthService = {
  register,
  login,
};
