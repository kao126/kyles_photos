import { toast } from 'sonner';
import { getS3PresignedUrl } from '@/lib/presigned-url';

export async function handleUpload({ e, userId }: { e: React.ChangeEvent<HTMLInputElement>; userId: string }) {
  try {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadingToastId = toast('アップロード中', {
      description: `Uploading ${files.length} files`,
      action: {
        label: 'Undo',
        onClick: () => toast.dismiss(uploadingToastId),
      },
    });

    const formData = new FormData();
    for (const file of files) {
      formData.append('files[]', file);
    }

    let successCount = 0;
    for (const file of files) {
      // S3にアップロード
      try {
        console.log('file: ', file);
        console.log('userId: ', userId);
        const url = await getS3PresignedUrl(file, userId);
        if (!url) continue;
        await fetch(url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });
        console.log('File uploaded successfully');
        successCount++;
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    }

    const completedToastId = toast('アプロード完了', {
      description: `${successCount} files uploaded successfully`,
      action: {
        label: 'Undo',
        onClick: () => toast.dismiss(completedToastId),
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

// export async function handleUpload({ e, userId }: { e: React.ChangeEvent<HTMLInputElement>; userId: string }) {
//   try {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     const uploadingToastId = toast('アップロード中', {
//       description: `Uploading ${files.length} files`,
//       action: {
//         label: 'Undo',
//         onClick: () => toast.dismiss(uploadingToastId),
//       },
//     });

//     const formData = new FormData();
//     for (const file of files) {
//       formData.append('files[]', file);
//     }

//     const res = await fetch(`/api/aws/s3?userId=${userId}`, {
//       method: 'POST',
//       body: formData,
//     });
//     const data = await res.json();
//     const completedToastId = toast('アプロード完了', {
//       description: `${data.successCount} files uploaded successfully`,
//       action: {
//         label: 'Undo',
//         onClick: () => toast.dismiss(completedToastId),
//       },
//     });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//   }
// }
