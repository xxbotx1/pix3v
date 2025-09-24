import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  title: string;
  onImageChange: (file: File | null) => void;
  previewUrl?: string;
}

export default function ImageUpload({ title, onImageChange, previewUrl }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageChange(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageChange(files[0]);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-foreground" data-testid={`text-${title.toLowerCase().replace(' ', '-')}`}>
        {title}
      </h3>
      <Card
        className={`relative min-h-48 border-2 border-dashed transition-all duration-200 hover-elevate cursor-pointer ${
          isDragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        data-testid={`upload-${title.toLowerCase().replace(' ', '-')}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {previewUrl ? (
          <div className="relative h-full min-h-48">
            <img
              src={previewUrl}
              alt={`${title} preview`}
              className="w-full h-full object-cover rounded-md"
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              data-testid={`button-remove-${title.toLowerCase().replace(' ', '-')}`}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-48 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Drop an image here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WebP up to 10MB
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}