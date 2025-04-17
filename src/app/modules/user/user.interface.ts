import { USER_ROLE } from "./user.constants";

export interface IUser {
	name: string;
	email: string;
	phoneNumber: string;
	password: string;
	role: 'admin' | 'landlord' | 'tenant';
  }
  export type TUserRole = keyof typeof USER_ROLE;  
