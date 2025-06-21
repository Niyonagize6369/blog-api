import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { ShareService } from "../services/share.service";
import { ApiResponse } from "../types/common.types";
import { NotFoundError } from "../utils/errors";

const shareService = new ShareService();

export const sharePost = asyncHandler(async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    const postId = parseInt(req.params.id);
    const share = await shareService.incrementShare(postId);

    res.json({
        success: true,
        message: "Post shared successfully",
        data: { count: share.count },
    });
});


export const getSharesCount = asyncHandler(async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    const postId = parseInt(req.params.id);
    const count = await shareService.getShareCount(postId);

    res.json({
        success: true,
        message: "Share count retrieved successfully",
        data: { count },
    });
});