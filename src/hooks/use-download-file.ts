'use client';

import { downloadS3Object } from '@/actions/aws/s3';

export function useDownloadFileLogic() {
  async function handleDownloadFile({ originalKey, fileName }: { originalKey: MediaEntryType['key']; fileName: MediaEntryType['fileName'] }) {
    try {
      const url = await downloadS3Object(originalKey, fileName);
      if (url) {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('ダウンロードリンクの取得に失敗しました');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }
  return { handleDownloadFile };
}
