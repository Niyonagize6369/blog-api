import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { User } from "./user";
import { Post } from "./Post";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    content!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, user => user.comments, { onDelete: "CASCADE" })
    user!: User;

    @ManyToOne(() => Post, post => post.comments, { onDelete: "CASCADE" })
    post!: Post;

    @ManyToOne(() => Comment, comment => comment.replies, { nullable: true })
    parentComment?: Comment;

    @OneToMany(() => Comment, comment => comment.parentComment)
    replies?: Comment[];
}