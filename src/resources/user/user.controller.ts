import Controller from "utils/interfaces/controller.interface";
import {NextFunction, Response, Router} from "express";
import UserService from "./user.service";
import validationMiddleware from "../../middleware/validation.middleware";
import HttpException from "../../utils/exceptions/http.exception";
import authenticatedMiddleware from "../../middleware/authenticated.middleware";
import validate from "../user/user.validation";


class UserController implements Controller {
    public path = '/user';
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );

        this.router.get(`${this.path}`, authenticatedMiddleware, this.getUser);
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, email, password } = req.body;
            const token = this.UserService.register(
                name,
                email,
                password,
                'user'
            );

            res.status(201).json({token});
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private login = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {email, password} = req.body;

            const token = await this.UserService.login(email, password);
            res.status(200).json({token});
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getUser = (
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        if (!req.user) {
            return next(new HttpException(404, 'No login user'));
        }
        res.status(200).json({ user: req.body });
    };
}

export default  UserController;
