import PostModel from "./post.model";
import Post from "./post.interface";

class PostService {
    private post = PostModel;

    public async create(title: string, body: string): Promise<Post> {
        try {
            return await this.post.create({title, body});
        } catch (e) {
            throw new Error('Unable to create post');
        }
    }
}

export default PostService;
