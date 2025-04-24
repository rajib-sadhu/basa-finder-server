import bcrypt from "bcrypt";
import { IUser } from "./user.interface";
import User from "./user.model";

const createAdmin = async (payload: IUser): Promise<IUser> => {
  payload.role = "admin";
  const result = await User.create(payload);

  return result;
};

const getUser = async () => {
  const result = await User.find();
  return result;
};
const getSingleUser = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const updateUser = async (_id: string, data: IUser) => {
  const result = await User.findByIdAndUpdate(_id, data, {
    new: true,
  });
  return result;
};

const updatePassword = async (
  userId: string,
  payload: { currentPassword: string; newPassword: string }
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.currentPassword,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Current password is incorrect");
  }

  if (payload.currentPassword === payload.newPassword) {
    throw new Error("New password cannot be same as current password");
  }

  const hashedNewPassword = await bcrypt.hash(payload.newPassword, 10);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { password: hashedNewPassword },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new Error("Failed to update password");
  }

  return updatedUser;
};

const deleteUser = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  return result;
};
const activationUser = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }
  const result = await User.findByIdAndUpdate(
    id,
    { isActive: !user.isActive },
    { new: true }
  );

  return result;
};
const changeUserRole = async (
  id: string,
  role: "admin" | "landlord" | "tenant"
) => {
  const validRoles = ["admin", "landlord", "tenant"];
  if (!validRoles.includes(role)) {
    throw new Error("Invalid role provided.");
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  return user;
};

export const userService = {
  createAdmin,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
  activationUser,
  changeUserRole,
  updatePassword,
};
