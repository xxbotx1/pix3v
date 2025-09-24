import { useState } from 'react';
import ImageUpload from '../ImageUpload';
import exampleImage from '@assets/generated_images/Renaissance_reading_portrait_f743189a.png';

export default function ImageUploadExample() {
  const [firstImage, setFirstImage] = useState<File | null>(null);
  const [lastImage, setLastImage] = useState<File | null>(null);
  const [firstImageUrl, setFirstImageUrl] = useState<string>(exampleImage);
  const [lastImageUrl, setLastImageUrl] = useState<string>('');

  const handleFirstImageChange = (file: File | null) => {
    setFirstImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setFirstImageUrl(url);
    } else {
      setFirstImageUrl('');
    }
  };

  const handleLastImageChange = (file: File | null) => {
    setLastImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setLastImageUrl(url);
    } else {
      setLastImageUrl('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <ImageUpload
        title="First Image"
        onImageChange={handleFirstImageChange}
        previewUrl={firstImageUrl}
      />
      <ImageUpload
        title="Last Image"
        onImageChange={handleLastImageChange}
        previewUrl={lastImageUrl}
      />
    </div>
  );
}