import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from "typeorm";
import { User } from "./user";
import { Post } from "./Post";

@Entity('likes')
@Unique(["user", "post"])
export class Like {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.likes, { onDelete: "CASCADE" })
    user: User | undefined;

    @ManyToOne(() => Post, post => post.likes, { onDelete: "CASCADE" })
    post: Post | undefined;
}