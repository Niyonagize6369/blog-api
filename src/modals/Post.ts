import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user';
import { Comment } from './Comment';
import { Like } from "./Likes";

export enum PostCategory {
  TECHNOLOGY ,
  ENTERTAINMENT ,
  EDUCATIONAL ,
  OTHER ,
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  title!: string;

  @Column({ length: 500,nullable: true })
  content!: string;

  @Column({ nullable: true })
  imageUrl!: string;

  @Column({
      type: 'enum',
      enum: PostCategory,
      default: PostCategory.OTHER,
  })
  category!: PostCategory;

  @Column({ default: false })
  isPublished!: boolean;

  @OneToMany(() => Like, like => like.post)
  likes: Like[] | undefined;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: number;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments!: Comment[];
  likesCount: any;
}