import { VideoGenerationRequest, VideoStatus, GeneratedVideo } from "@shared/schema";

const API_BASE = import.meta.env.DEV ? '' : '';

export class APIError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'APIError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new APIError(response.status, errorData.error || 'API request failed', errorData);
  }
  return response.json();
}

export const api = {
  // Upload images
  async uploadImages(files: [File, File]): Promise<{ firstImageUrl: string; lastImageUrl: string }> {
    const formData = new FormData();
    formData.append('images', files[0]);
    formData.append('images', files[1]);

    const response = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    return handleResponse(response);
  },

  // Generate videos
  async generateVideos(request: VideoGenerationRequest): Promise<{ taskIds: string[]; status: string }> {
    const response = await fetch(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return handleResponse(response);
  },

  // Check single video status
  async checkVideoStatus(taskId: string): Promise<VideoStatus> {
    const response = await fetch(`${API_BASE}/api/status/${taskId}`);
    return handleResponse(response);
  },

  // Check multiple video statuses
  async checkBatchStatus(taskIds: string[]): Promise<{ statuses: VideoStatus[] }> {
    const response = await fetch(`${API_BASE}/api/status/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskIds }),
    });

    return handleResponse(response);
  },
};

// Helper to convert VideoStatus to GeneratedVideo
export function statusToGeneratedVideo(status: VideoStatus, index: number): GeneratedVideo | null {
  if (status.status === 'completed' && status.videoUrl) {
    return {
      id: `video-${index + 1}`,
      title: `Video ${index + 1}`,
      videoUrl: status.videoUrl,
      status: 'completed',
      duration: '5.0s', // This should come from API response
      fileSize: '12.5MB', // This should come from API response
      taskId: status.taskId,
    };
  } else if (status.status === 'failed') {
    return {
      id: `video-${index + 1}`,
      title: `Video ${index + 1}`,
      videoUrl: '',
      status: 'failed',
      duration: '0s',
      fileSize: '0MB',
      taskId: status.taskId,
    };
  }
  return null;
}