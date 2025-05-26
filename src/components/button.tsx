'use client';

export function Button() {
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0];
      if (file) {
        // APIへアップロード
        const formData = new FormData();
        formData.append('file', file);

        await fetch('/api/aws/s3', {
          method: 'POST',
          body: formData,
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  return <input type='file' onChange={handleUpload} />;
}
