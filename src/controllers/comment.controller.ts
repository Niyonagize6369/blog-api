import { Response, Request, NextFunction } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import {CommentService} from '../services/comment.service';
import { AuthenticatedRequest, ApiResponse } from "../types/common.types";
import { ForbiddenError, NotFoundError } from "../utils/errors";

const commentService = new CommentService();

// POST /posts/:id/comments
export const createComment = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    const userId = Number(req.user?.id);
    const postId = parseInt(req.params.id);
    const { content, parentCommentId } = req.body;

    if (!userId) {
        throw new ForbiddenError("You must be logged in to comment");
    }

    const comment = await commentService.createComment({
        content,
        postId,
        userId,
        parentCommentId,
    });

    res.status(201).json({
        success: true,
        message: "Comment created successfully",
        data: { comment },
    });
});

// GET /posts/:id/comments
export const getCommentsByPost = asyncHandler(async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    const postId = parseInt(req.params.id);

    const comments = await commentService.getCommentsByPost(postId);

    res.json({
        success: true,
        message: "Comments retrieved successfully",
        data: { comments },
    });
});

// PUT /comments/:id
export const updateComment = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    const commentId = parseInt(req.params.id);
    const userId = Number(req.user?.id);
    const { content } = req.body;

    if (!userId) {
        throw new ForbiddenError("You must be logged in to update a comment");
    }

    const updatedComment = await commentService.updateComment(commentId, userId, content);

    if (!updatedComment) {
        throw new ForbiddenError("You can only edit your own comments");
    }

    res.json({
        success: true,
        message: "Comment updated successfully",
        data: { comment: updatedComment },
    });
});

// DELETE /comments/:id
export const deleteComment = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    const commentId = parseInt(req.params.id);
    const userId = Number(req.user?.id);

    if (!userId) {
        throw new ForbiddenError("You must be logged in to delete a comment");
    }

    const deleted = await commentService.deleteComment(commentId, userId);

    if (!deleted) {
        throw new ForbiddenError("You can only delete your own comments");
    }

    res.json({
        success: true,
        message: "Comment deleted successfully",
    });
});