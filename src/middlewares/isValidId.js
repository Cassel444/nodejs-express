import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";

export const isValidId = (idName = "id") => (req, res, next) => {
    const id = req.params[idName];

    if (!id) {
        throw createHttpError("id in isValidId is not provided ");
    }
    if (!isValidObjectId(id)) {
        return next(createHttpError(404, "Not valid id"));
    }
    return next();
};
