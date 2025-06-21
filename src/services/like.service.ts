import { AppDataSource } from "../config/database";
import { Like } from "../modals/Likes";
import { User } from "../modals/user";
import { Post } from "../modals/Post";

export class LikeService {
    private likeRepository = AppDataSource.getRepository(Like);
    private postRepository = AppDataSource.getRepository(Post);
    private userRepository = AppDataSource.getRepository(User);

    async likePost(postId: number, userId: number): Promise<boolean> {
        const existingLike = await this.likeRepository.findOne({
            where: {
                post: { id: postId },
                user: { id: userId },
            },
            relations: ["post", "user"],
        });

        if (existingLike) {
            return false;
        }

        const user = await this.userRepository.findOneBy({ id: userId });
        const post = await this.postRepository.findOneBy({ id: postId });

        if (!user || !post) {
            throw new Error("User or Post not found");
        }

        const newLike = this.likeRepository.create({ user, post });
        await this.likeRepository.save(newLike);

        post.likesCount = (post.likesCount || 0) + 1;
        await this.postRepository.save(post);

        return true;
    }

    async unlikePost(postId: number, userId: number): Promise<boolean> {
        const existingLike = await this.likeRepository.findOne({
            where: {
                post: { id: postId },
                user: { id: userId },
            },
            relations: ["post", "user"],
        });

        if (!existingLike) {
            return false;
        }

        await this.likeRepository.delete(existingLike.id);

        const post = await this.postRepository.findOneBy({ id: postId });
        if (post && post.likesCount && post.likesCount > 0) {
            post.likesCount--;
            await this.postRepository.save(post);
        }

        return true;
    }

    async countLikes(postId: number): Promise<number> {
        return await this.likeRepository.count({
            where: { post: { id: postId } },
        });
    }
}