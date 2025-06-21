import { Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { 
  CreatePost,
  GetPostById,
  DeletePost,
  UpdatePost
} from '../schemas/post.schemas';
import { AuthenticatedRequest, ApiResponse } from '../types/common.types';
import { PostService } from '../services/post.service';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { LikeService } from "../services/like.service";

const postService = new PostService();
const likeService = new LikeService();

export const createPost = asyncHandler(async (
    req: AuthenticatedRequest & CreatePost,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
  const { title, content, imageUrl, category } = req.body;
  const userId = Number(req.user?.id);
  const userRole = req.user?.role;
  // console.log("userId:", userId);
  // console.log("userRole:", userRole);
  // console.log(req.user);


  if (!userId || !["admin", "superadmin"].includes(userRole)) {
    throw new ForbiddenError("Only admins and super admins can create posts");
  }

  const newPost = await postService.create({
    title,
    content,
    imageUrl,
    category,
    userId
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: {
      post: {
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        userId: userId,
        // author: newPost.user.name
      },
    },
  });
});


export const getAllPosts = asyncHandler(async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const posts = await postService.findAll();
  
  res.json({
    success: true,
    message: 'Posts retrieved successfully',
    data: {
      posts
    }
  });
});

export const getPostById = asyncHandler(async (
  req: AuthenticatedRequest & GetPostById,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { id } = req.params;
  
  const post = await postService.findById(Number(id));
  if (!post) {
    throw new NotFoundError('Post');
  }
  
  res.json({
    success: true,
    message: 'Post retrieved successfully',
    data: { post }
  });
});

export const updatePost = asyncHandler(async (
    req: AuthenticatedRequest & UpdatePost,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
  const { id } = req.params;
  const { title, content, imageUrl, category, isPublished } = req.body;
  const userId = Number(req.user?.id);
  const userRole = req.user?.role;

  const existingPost = await postService.findByIdWithUser(Number(id));
  if (!existingPost) {
    throw new NotFoundError("Post");
  }

  // Role-based access control
  if (userRole === "admin" && existingPost.user?.id !== userId) {
    throw new ForbiddenError("Admins can only update their own posts");
  }

  if (userRole === "user") {
    throw new ForbiddenError("Users are not allowed to update posts");
  }

  const updatedPost = await postService.update(id, {
    title,
    content,
    imageUrl,
    category,
    isPublished,
  });

  res.json({
    success: true,
    message: "Post updated successfully",
    data: { post: updatedPost },
  });
});


export const deletePost = asyncHandler(async (
    req: AuthenticatedRequest & DeletePost,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
  const { id } = req.params;
  const userId = Number(req.user?.id);
  const userRole = req.user?.role;

  const existingPost = await postService.findByIdWithUser(Number(id));
  if (!existingPost) {
    throw new NotFoundError("Post");
  }

  // Role-based access control
  if (userRole === "admin" && existingPost.user?.id !== userId) {
    throw new ForbiddenError("Admins can only delete their own posts");
  }

  if (userRole === "user") {
    throw new ForbiddenError("Users are not allowed to delete posts");
  }

  const deleted = await postService.delete(Number(id));
  if (!deleted) {
    throw new Error("Failed to delete post");
  }

  res.json({
    success: true,
    message: "Post deleted successfully",
  });
});

export const likePost = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
  const postId = parseInt(req.params.id);
  const userId = Number(req.user?.id);

  if (!userId) {
    throw new ForbiddenError("You must be logged in to like a post");
  }

  const post = await postService.findById(postId);
  if (!post) {
    throw new NotFoundError("Post");
  }

  const liked = await likeService.likePost(postId, userId);

  res.json({
    success: true,
    message: liked ? "Post liked successfully" : "You already liked this post",
    data: { liked },
  });
});

export const getLikesCount = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
  const postId = parseInt(req.params.id);
  const post = await postService.findById(postId);

  if (!post) {
    throw new NotFoundError("Post");
  }

  const count = await likeService.countLikes(postId);

  res.json({
    success: true,
    message: "Like count retrieved successfully",
    data: { count },
  });
});

// POST /posts/:id/unlike
export const unlikePost = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
  const postId = parseInt(req.params.id);
  const userId = Number(req.user?.id);

  if (!userId) {
    throw new ForbiddenError("You must be logged in to unlike a post");
  }

  const post = await postService.findById(postId);
  if (!post) {
    throw new NotFoundError("Post");
  }

  const unliked = await likeService.unlikePost(postId, userId);

  res.json({
    success: true,
    message: unliked ? "Post unliked successfully" : "You have not liked this post yet",
    data: { unliked },
  });
});