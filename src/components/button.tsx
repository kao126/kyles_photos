'use client';
import { uploadFile } from '@/hooks/upload-file';

export function Button() {
  function convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = event.target.files?.[0];
      if (file) {
        const base64 = await convertFileToBase64(file);
        await uploadFile(base64, file.name);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
  return <input type='file' onChange={handleUpload} />;
}
