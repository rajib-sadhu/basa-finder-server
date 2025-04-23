import { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userService.createAdmin(payload);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Admin created successfully",
    data: result,
  });
});
const getUser = async (req: Request, res: Response) => {
  const result = await userService.getUser();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User get successfully",
    data: result,
  });
};

const getSingleUser = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const result = await userService.getSingleUser(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User get successfully",
    data: result,
  });
};

const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const body = req.body;
  const result = await userService.updateUser(userId, body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User update successfully",
    data: result,
  });
};

const updatePassword = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  // Validate required fields
  if (!currentPassword || !newPassword) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: "Both currentPassword and newPassword are required",
      data: {},
    });
  }

  const result = await userService.updatePassword(userId, {
    currentPassword,
    newPassword,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Password updated successfully",
    data: result,
  });
});

const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  await userService.deleteUser(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User deleted successfully",
    data: {},
  });
};
const activationUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const result = await userService.activationUser(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User activation changed",
    data: result,
  });
};

const changeUserRole = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { role } = req.body;

  const result = await userService.changeUserRole(userId, role);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User role updated successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
  activationUser,
  changeUserRole,
  updatePassword,
};
