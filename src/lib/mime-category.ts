export function getMimeCategory(mime: string): MediaEntryType['fileMimeCategory'] {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  return 'other';
}
