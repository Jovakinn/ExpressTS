import User from "../../resources/post/user/user.interface";

declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
    }
}
