import { NextFunction, Request, Response } from "express"
import { handlerZodError } from './../errors/handleZodError';
import { handleCastError } from './../errors/handleCastError';
import mongoose from "mongoose";
import { handleValidationError } from './../errors/handlerValidationError';
import { handlerDuplicateError } from './../errors/handleDuplicateError';
import { handleGenericError } from './../errors/handleGenericError';

type TErrorResponse = {
    success: boolean
    message: string
    error: any
}

export const globalErrorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    if (err.name && err.name === "ZodError") {
        handlerZodError(err, res)
    }
    else if (err instanceof mongoose.Error.CastError) {
        handleCastError(err, res)
    }
    else if (err instanceof mongoose.Error.ValidationError) {
        handleValidationError(err, res)
    }
    else if (err.code && err.code === 11000) {
        handlerDuplicateError(err, res)
    }
    else if (err instanceof Error) {
        handleGenericError
        (err, res)
    }
}