import { z } from "zod";

// Video generation schemas
export const videoGenerationRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  videoCount: z.number().min(1).max(3),
  quality: z.enum(["720p", "1080p"]),
  firstImageUrl: z.string().url(),
  lastImageUrl: z.string().url(),
});

export const videoGenerationResponseSchema = z.object({
  taskIds: z.array(z.string()),
  status: z.string(),
});

export const videoStatusSchema = z.object({
  taskId: z.string(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  progress: z.number().optional(),
  videoUrl: z.string().optional(),
  error: z.string().optional(),
});

export const generatedVideoSchema = z.object({
  id: z.string(),
  title: z.string(),
  videoUrl: z.string(),
  thumbnailUrl: z.string().optional(),
  status: z.enum(["completed", "failed"]),
  duration: z.string(),
  fileSize: z.string(),
  taskId: z.string(),
});

export type VideoGenerationRequest = z.infer<typeof videoGenerationRequestSchema>;
export type VideoGenerationResponse = z.infer<typeof videoGenerationResponseSchema>;
export type VideoStatus = z.infer<typeof videoStatusSchema>;
export type GeneratedVideo = z.infer<typeof generatedVideoSchema>;
