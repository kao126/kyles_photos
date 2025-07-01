type MediaEntryType = {
  fileName: string;
  fileMimeCategory: 'image' | 'video' | 'other';
  key: string;
  day: string;
  url: string;
  lastModifiedDate: Date;
  isDeleted: boolean;
};
