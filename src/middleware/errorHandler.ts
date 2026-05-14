import { Request, Response, NextFunction } from "express";

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Global Error:", err);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};

export default errorHandler;