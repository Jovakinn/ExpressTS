import { Document } from 'mongoose';

export default interface Post extends Document {
    tittle: string;
    body: string;
}
