import { z } from "zod";
import {booleanSchema, contentSchema, idParamSchema, imgSchema, categorySchema, titleSchema} from "./common.schemas";

export const createPostSchema = z.object({
  body: z.object({
    title: titleSchema,
    content: contentSchema,
    imageUrl: imgSchema,
    category:  categorySchema,
  }),
});

export const updatePostSchema = z.object({
    body: z.object({
        title: titleSchema.optional(),
        content: contentSchema.optional(),
        imageUrl: imgSchema.optional(),
        category: categorySchema.optional(),
        isPublished: booleanSchema.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "Update at least one field"
    }),
})

export const getPostByIdSchema = z.object({
  params: idParamSchema,
})

export const deletePostSchema = z.object({
  params: idParamSchema,
});


export type CreatePost = z.infer<typeof createPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
export type GetPostById = z.infer<typeof getPostByIdSchema>;
export type DeletePost = z.infer<typeof deletePostSchema>;