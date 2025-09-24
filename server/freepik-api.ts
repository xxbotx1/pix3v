import axios from 'axios';

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY;
const FREEPIK_BASE_URL = 'https://api.freepik.com/v1/ai/image-to-video/pixverse-v5-transition';

export interface FreepikVideoRequest {
  prompt: string;
  first_image_url: string;
  last_image_url: string;
  resolution: '720p' | '1080p';
  duration: number;
  seed: number;
}

export interface FreepikVideoResponse {
  data: [{
    id: string;
    status: string;
  }];
}

export interface FreepikStatusResponse {
  data: [{
    id: string;
    status: string;
    generated?: string;
    generated_files?: string[];
    video_url?: string;
    error?: string;
    message?: string;
  }];
}

export class FreepikAPI {
  private apiKey: string;

  constructor() {
    if (!FREEPIK_API_KEY) {
      throw new Error('FREEPIK_API_KEY environment variable is required');
    }
    this.apiKey = FREEPIK_API_KEY;
  }

  async generateVideo(request: FreepikVideoRequest): Promise<string> {
    try {
      console.log('Sending request to Freepik API:', {
        ...request,
        first_image_url: request.first_image_url.substring(0, 50) + '...',
        last_image_url: request.last_image_url.substring(0, 50) + '...'
      });

      const response = await axios.post<FreepikVideoResponse>(
        FREEPIK_BASE_URL,
        request,
        {
          headers: {
            'x-freepik-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.data?.[0]?.id) {
        console.log('Successfully created Freepik task:', response.data.data[0].id);
        return response.data.data[0].id;
      } else {
        throw new Error('Invalid response from Freepik API');
      }
    } catch (error) {
      console.error('Freepik API error:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Freepik API error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async checkVideoStatus(taskId: string): Promise<{ status: string; videoUrl?: string; error?: string }> {
    try {
      // Try the status endpoint - might be different from generation endpoint
      const statusUrl = `https://api.freepik.com/v1/ai/image-to-video/pixverse-v5-transition/status/${taskId}`;
      
      const response = await axios.get<FreepikStatusResponse>(
        statusUrl,
        {
          headers: {
            'x-freepik-api-key': this.apiKey,
          },
        }
      );

      const data = response.data?.data?.[0];
      if (!data) {
        throw new Error('Invalid status response from Freepik API');
      }

      // Extract video URL from various possible response fields
      const videoUrl = data.generated || data.video_url || (data.generated_files && data.generated_files[0]);

      return {
        status: data.status,
        videoUrl: videoUrl,
        error: data.error || data.message,
      };
    } catch (error) {
      console.error('Freepik status check error:', error);
      if (axios.isAxiosError(error)) {
        // If status endpoint doesn't exist, try original endpoint
        if (error.response?.status === 404) {
          try {
            const response = await axios.get<FreepikStatusResponse>(
              `${FREEPIK_BASE_URL}/${taskId}`,
              {
                headers: {
                  'x-freepik-api-key': this.apiKey,
                },
              }
            );
            
            const data = response.data?.data?.[0];
            if (data) {
              const videoUrl = data.generated || data.video_url || (data.generated_files && data.generated_files[0]);
              return {
                status: data.status,
                videoUrl: videoUrl,
                error: data.error || data.message,
              };
            }
          } catch (fallbackError) {
            console.error('Fallback status check also failed:', fallbackError);
          }
        }
        
        throw new Error(`Freepik status check error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }
}

export const freepikAPI = new FreepikAPI();