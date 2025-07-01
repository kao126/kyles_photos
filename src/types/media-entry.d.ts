type MediaEntryType = {
  fileName: string;
  fileMimeCategory: 'image' | 'video' | 'other';
  baseFileName: string;
  key: string;
  day: string;
  url: string;
  lastModifiedDate: Date;
  isDeleted: boolean;
};
