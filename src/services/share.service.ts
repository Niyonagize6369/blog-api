import { AppDataSource } from "../config/database";
import { Share } from "../modals/Share";
import { Post } from "../modals/Post";

export class ShareService {
    private shareRepository = AppDataSource.getRepository(Share);
    private postRepository = AppDataSource.getRepository(Post);

    // Increment share count for a post
    async incrementShare(postId: number): Promise<Share> {
        const post = await this.postRepository.findOneBy({ id: postId });
        if (!post) {
            throw new Error("Post not found");
        }

        let share = await this.shareRepository.findOne({ where: { post: { id: postId } } });

        if (!share) {
            share = this.shareRepository.create({ post, count: 1 });
        } else {
            share.count++;
        }

        return await this.shareRepository.save(share);
    }

    // Get share count for a post
    async getShareCount(postId: number): Promise<number> {
        const share = await this.shareRepository.findOne({ where: { post: { id: postId } } });
        return share?.count ?? 0;
    }
}