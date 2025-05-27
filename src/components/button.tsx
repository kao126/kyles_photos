'use client';

export function Button() {
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }

      await fetch('/api/aws/s3', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  return <input type='file' accept='image/*,video/*' multiple onChange={handleUpload} />;
}
