import { Router, Request, Response, NextFunction } from "express";
import validate from '../post/post.validation'
import Controller from "../../utils/interfaces/controller.interface";
import HttpException from "../../utils/exceptions/http.exception";
import validationMiddleware from "../../middleware/validation.middleware";
import PostService from "./post.service";

class PostController implements Controller {
    public path = '/posts';
    public router = Router();
    private PostService = new PostService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}`,
            validationMiddleware(validate.create),
            this.create
        );
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { tittle, body } = req.body;

            const post = await this.PostService.create(tittle, body);

            res.status(201).json({ post });
        } catch (e) {
            next(new HttpException(400, 'Cannot create post'));
        }
    };
}

export default PostController;
