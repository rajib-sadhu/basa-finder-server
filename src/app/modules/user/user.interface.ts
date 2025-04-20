import { USER_ROLE } from "./user.constants";

export interface IUser {
  name: string;
  email: string;
  phoneNumber: string;
  _id: string;
  password: string;
  role: "admin" | "landlord" | "tenant";
  isBlocked: boolean;
}
export type TUserRole = keyof typeof USER_ROLE;
