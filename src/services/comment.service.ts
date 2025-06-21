import { AppDataSource } from "../config/database";
import { Comment } from "../modals/Comment";
import { Post } from "../modals/Post";
import { User } from "../modals/user";

export class CommentService {
    private commentRepository = AppDataSource.getRepository(Comment);
    private postRepository = AppDataSource.getRepository(Post);
    private userRepository = AppDataSource.getRepository(User);
    // private parentRepository = AppDataSource.getRepository(Comment);

    async createComment(data: {
        content: string;
        postId: number;
        userId: number;
        parentCommentId?: number;
    }): Promise<Comment> {
        const { content, postId, userId, parentCommentId } = data;

        const post = await this.postRepository.findOneBy({ id: postId });
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!post || !user) throw new Error("Post or user not found");

        const comment = this.commentRepository.create({
            content,
            post,
            user,
        });

        if (parentCommentId) {
            const parentComment = await this.commentRepository.findOneBy({ id: parentCommentId });
            if (!parentComment) throw new Error("Parent comment not found");
            comment.parentComment = parentComment;
        }

        return await this.commentRepository.save(comment);
    }

    async getCommentsByPost(postId: number): Promise<Comment[]> {
        return await this.commentRepository.find({
            where: { post: { id: postId }, parentComment: undefined },
            relations: ["user", "replies", "replies.user"],
            order: { createdAt: "DESC" },
        });
    }

    async updateComment(id: number, userId: number, content: string): Promise<Comment | null> {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ["user"],
        });

        if (!comment || comment.user.id !== userId) {
            return null;
        }

        comment.content = content;
        return await this.commentRepository.save(comment);
    }

    async deleteComment(id: number, userId: number): Promise<boolean> {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ["user"],
        });

        if (!comment || comment.user.id !== userId) {
            return false;
        }

        const result = await this.commentRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}