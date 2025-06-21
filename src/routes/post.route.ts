import express, { Router } from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost, likePost, unlikePost, getLikesCount
} from '../controllers/post.controller';

import {
  sharePost,
  getSharesCount
} from "../controllers/share.controller";

import {
  createComment,
    getCommentsByPost,
    updateComment,
    deleteComment
} from "../controllers/comment.controller";
import { authenticated } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validation.middleware';
import { 
    createPostSchema,
    getPostByIdSchema,
    updatePostSchema,
    deletePostSchema
  } from '../schemas/post.schemas';

const router: Router = express.Router();

// Public routes (viewing posts)
router.get('/', getAllPosts);
router.get('/:id', validate(getPostByIdSchema), getPostById);

// Protected routes - require authentication
// router.use(authenticated);

// Only authenticated users can create posts
router.post('/create', 
  validate(createPostSchema),
  authenticated,
  createPost
);

router.put('/like/:id', authenticated, likePost);

// Author can update/delete their own posts
router.put('/:id',
  // authorize(['admin']),
  authenticated,
  validate(updatePostSchema),
  updatePost
);

router.delete('/:id',
  // authorize(['admin']),
  authenticated,
  validate(deletePostSchema), 
  deletePost
);

// Admins can also delete posts
router.delete('/admin/:id', 
  authorize(['admin']),
  validate(deletePostSchema),
  deletePost
);

router.post("/:id/comment", authenticated, createComment);
router.get("/:id/comments", getCommentsByPost);
router.put("/:id/comment/:id", authenticated, updateComment);
router.delete(":id/comment/:id", authenticated, deleteComment);
router.post("/:id/like",authenticated, likePost);
router.delete("/:id/like",authenticated, unlikePost);
router.get("/:id/likes", getLikesCount);
router.post("/:id/share", authenticated, sharePost);
router.get("/:id/shares", getSharesCount);


export default router;