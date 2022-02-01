import UserModel from "./user.model";
import token from "../../../utils/token";

class UserService {
    private user = UserModel;

    /**
     * Attempting to register a new user
     * @param name
     * @param email
     * @param password
     * @param role
     */
    public async register(
        name: string,
        email: string,
        password: string,
        role: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.create({name, email, password, role});
            return token.createToken(user);
        } catch (err) {
            throw new Error('Unable to create user');
        }
    }

    /**
     * Attempting to login a user
     */

    public async login(
        email: string,
        password: string,
    ): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ email });
            if (!user) {
                throw new Error('User with this email was not found');
            }
            if (await user.isValidPassword(password)) {
                return token.createToken(user);
            } else {
                throw new Error('Wrong credentials');
            }
        }
         catch (err) {
            throw new Error('Unable to login user');
         }
    }
}
export default UserService;
