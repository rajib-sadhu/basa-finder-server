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
  console.log(id);
  const result = await User.findById(id);
  console.log(result);
  return result;
};

const updateUser = async (id: string, data: IUser) => {
  const result = await User.findByIdAndUpdate(id, data, {
    new: true,
  });
  return result;
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
};
