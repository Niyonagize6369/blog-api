import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class Share {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Post, { onDelete: "CASCADE" })
    @JoinColumn()
    post!: Post;

    @Column({ default: 0 })
    count!: number;
}