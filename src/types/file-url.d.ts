type fileUrlsType<T = MediaEntryType> = {
  [year: string]: { [month: string]: T[] };
};
