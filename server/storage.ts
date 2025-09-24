import { type VideoStatus } from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for video generation tasks
export interface IStorage {
  // Video generation task management
  saveVideoTask(taskId: string, status: VideoStatus): Promise<void>;
  getVideoTask(taskId: string): Promise<VideoStatus | undefined>;
  updateVideoTask(taskId: string, updates: Partial<VideoStatus>): Promise<void>;
  getAllVideoTasks(): Promise<VideoStatus[]>;
}

export class MemStorage implements IStorage {
  private videoTasks: Map<string, VideoStatus>;

  constructor() {
    this.videoTasks = new Map();
  }

  async saveVideoTask(taskId: string, status: VideoStatus): Promise<void> {
    this.videoTasks.set(taskId, status);
  }

  async getVideoTask(taskId: string): Promise<VideoStatus | undefined> {
    return this.videoTasks.get(taskId);
  }

  async updateVideoTask(taskId: string, updates: Partial<VideoStatus>): Promise<void> {
    const existing = this.videoTasks.get(taskId);
    if (existing) {
      this.videoTasks.set(taskId, { ...existing, ...updates });
    }
  }

  async getAllVideoTasks(): Promise<VideoStatus[]> {
    return Array.from(this.videoTasks.values());
  }
}

export const storage = new MemStorage();
