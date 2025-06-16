'use server';
import * as exifr from 'exifr';

export async function getImageMetadata(buffer: Buffer, dateStr: string) {
  let exifData: { DateTimeOriginal?: string } = {};
  try {
    exifData = await exifr.parse(buffer, ['DateTimeOriginal']);
    dateStr = exifData?.DateTimeOriginal ? new Date(exifData.DateTimeOriginal).toISOString() : dateStr;
  } catch (e) {
    console.error('Failed to extract EXIF data:', e);
  }

  return dateStr;
}
