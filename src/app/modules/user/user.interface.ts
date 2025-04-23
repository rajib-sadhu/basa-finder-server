import { USER_ROLE } from "./user.constants";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: "admin" | "landlord" | "tenant";
  isActive: boolean;
}
export type TUserRole = keyof typeof USER_ROLE;
