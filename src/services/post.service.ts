import { AppDataSource } from "../config/database";
import {Post} from "../modals/Post";
import {Like} from "../modals/Likes";
import {User} from "../modals/user";

export class PostService {
  private postRepository = AppDataSource.getRepository(Post);
  private likeRepository = AppDataSource.getRepository(Like);
  private userRepository = AppDataSource.getRepository(User);

  async create(data: {
    title: string;
    content: string;
    imageUrl: string;
    category: number;
    userId: number;
  }): Promise<Post> {
    const post = this.postRepository.create(data);
    return await this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async findById(id: number): Promise<Post | null> {
    return await this.postRepository.findOneBy({ id });
  }

  async update(id: string, updatedData: Partial<Post>): Promise<Post | null> {
    const post = await this.postRepository.findOneBy({ id: parseInt(id) });
    if (!post) return null;

    Object.assign(post, updatedData);
    return await this.postRepository.save(post);
  }


  async delete(id: number): Promise<boolean> {
    const result = await this.postRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findByIdWithUser(id: number): Promise<Post | null> {
    return this.postRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }
}