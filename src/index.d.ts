// import { JwtPayload } from 'jsonwebtoken';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: JwtPayload;
//     }
//   }
// }
import { IUser } from "../modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      socketAuthToken: string;
    }
  }
}