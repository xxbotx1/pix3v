import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { join, extname } from "path";
import { randomUUID } from "crypto";
import { mkdirSync, existsSync } from "fs";
import { storage } from "./storage";
import { freepikAPI } from "./freepik-api";
import { videoGenerationRequestSchema, type VideoStatus } from "@shared/schema";

// Ensure uploads directory exists
const uploadsDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads with disk storage
const upload = multer({
  storage: multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
      cb(null, uploadsDir);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const safeExt = extname(file.originalname).toLowerCase();
      const uniqueName = `${randomUUID()}${safeExt}`;
      cb(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /\.(jpeg|jpg|png|webp)$/i;
    const allowedMimes = /^image\/(jpeg|png|webp)$/;
    
    const extName = allowedTypes.test(file.originalname);
    const mimeType = allowedMimes.test(file.mimetype);
    
    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded images statically
  app.use('/api/uploads', express.static(uploadsDir));

  // Upload images endpoint
  app.post('/api/upload', upload.array('images', 2), (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || !Array.isArray(files) || files.length !== 2) {
        return res.status(400).json({ error: 'Please upload exactly 2 images' });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const imageUrls = files.map((file: Express.Multer.File) => `${baseUrl}/api/uploads/${file.filename}`);
      
      console.log('Images uploaded successfully:', imageUrls);
      res.json({ 
        firstImageUrl: imageUrls[0], 
        lastImageUrl: imageUrls[1] 
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload images' });
    }
  });

  // Generate videos endpoint
  app.post('/api/generate', async (req, res) => {
    try {
      const validationResult = videoGenerationRequestSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Invalid request data', 
          details: validationResult.error.errors 
        });
      }

      const { prompt, videoCount, quality, firstImageUrl, lastImageUrl } = validationResult.data;
      const duration = quality === '1080p' ? 5 : 8;

      console.log('Starting video generation:', { prompt, videoCount, quality });

      // Create multiple video generation requests
      const taskIds: string[] = [];
      const requests = Array.from({ length: videoCount }, (_, i) => {
        const seed = Math.floor(Math.random() * 1000000);
        return freepikAPI.generateVideo({
          prompt,
          first_image_url: firstImageUrl,
          last_image_url: lastImageUrl,
          resolution: quality,
          duration,
          seed,
        });
      });

      try {
        const results = await Promise.all(requests);
        taskIds.push(...results);

        // Store initial task statuses
        for (const taskId of taskIds) {
          const videoStatus: VideoStatus = {
            taskId,
            status: 'pending',
            progress: 0,
          };
          await storage.saveVideoTask(taskId, videoStatus);
        }

        console.log('Successfully created tasks:', taskIds);
        res.json({ taskIds, status: 'started' });
      } catch (error) {
        console.error('Error generating videos:', error);
        res.status(500).json({ error: 'Failed to start video generation' });
      }
    } catch (error) {
      console.error('Generate endpoint error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Check video status endpoint
  app.get('/api/status/:taskId', async (req, res) => {
    try {
      const { taskId } = req.params;
      const storedStatus = await storage.getVideoTask(taskId);
      
      if (!storedStatus) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // If already completed or failed, return stored status
      if (storedStatus.status === 'completed' || storedStatus.status === 'failed') {
        return res.json(storedStatus);
      }

      // Check with Freepik API for updates
      try {
        const freepikStatus = await freepikAPI.checkVideoStatus(taskId);
        let updatedStatus: VideoStatus = { ...storedStatus };

        if (freepikStatus.status === 'completed' && freepikStatus.videoUrl) {
          updatedStatus = {
            ...storedStatus,
            status: 'completed',
            progress: 100,
            videoUrl: freepikStatus.videoUrl,
          };
        } else if (freepikStatus.status === 'failed') {
          updatedStatus = {
            ...storedStatus,
            status: 'failed',
            error: freepikStatus.error || 'Video generation failed',
          };
        } else {
          // Still processing
          updatedStatus = {
            ...storedStatus,
            status: 'processing',
            progress: Math.min(90, (storedStatus.progress || 0) + 10),
          };
        }

        await storage.updateVideoTask(taskId, updatedStatus);
        res.json(updatedStatus);
      } catch (error) {
        console.error('Status check error:', error);
        res.json(storedStatus); // Return stored status if API check fails
      }
    } catch (error) {
      console.error('Status endpoint error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get all video statuses for batch checking
  app.post('/api/status/batch', async (req, res) => {
    try {
      const { taskIds } = req.body;
      if (!Array.isArray(taskIds)) {
        return res.status(400).json({ error: 'taskIds must be an array' });
      }

      const statuses = [];
      for (const taskId of taskIds) {
        const status = await storage.getVideoTask(taskId);
        if (status) {
          statuses.push(status);
        }
      }

      res.json({ statuses });
    } catch (error) {
      console.error('Batch status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
