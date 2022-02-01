import {model, Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import User from './user.interface'

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

UserSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 17);

    next();
});

UserSchema.methods.isValidPassword = async function (
    password: string
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
}

export default model<User>('User', UserSchema);
