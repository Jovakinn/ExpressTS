import {NextFunction, Request, Response } from "express";
import token, { verifyToken } from "../utils/token";
import HttpException from "../utils/exceptions/http.exception";
import jwt from 'jsonwebtoken';
import Token from "../utils/interfaces/token.interface";
import UserModel from "../resources/user/user.model";

async function authenticatedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer  = req.headers.authorization;

    if (!bearer || !bearer.startsWith("Bearer ")) {
        return res.status(401).json({error: 'Unauthorized'});
    }
    const accessToken = bearer.split('Bearer ')[1].trim();
    try {
        const payload: Token | jwt.JsonWebTokenError = await verifyToken(accessToken);

        if (payload instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({error: 'Unauthorized'});
        }

        const user = await UserModel.findById(payload.id)
            .select('.password').exec();

        if (!user) {
            return next(new HttpException(401, 'Unauthorized'));
        }

        req.user = user;

        return next();
    } catch (err) {
        return next(new HttpException(401, 'Unauthorized'));
    }
}

export default authenticatedMiddleware;
