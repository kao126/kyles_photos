import { type Session } from 'next-auth';
import { type RefObject } from 'react';
import { create } from 'zustand';

type FileState = {
  signedUrls: fileUrlsType;
  nextContinuationToken: string | undefined;
  isTruncated: boolean;
  fetchFileUrls: (userId: Session['userId'], isRecentlyDeletedPage: boolean) => void;
  updateFileUrls: (isFetchingRef: RefObject<boolean>, userId: Session['userId'], isRecentlyDeletedPage: boolean) => void;
  reset: () => void;
};

export const useFileUrlStore = create<FileState>((set, get) => ({
  signedUrls: {},
  nextContinuationToken: undefined,
  isTruncated: false,
  fetchFileUrls: (userId, isRecentlyDeletedPage) => {
    const url = isRecentlyDeletedPage ? `/api/aws/s3?userId=${userId}&isDeleted=true` : `/api/aws/s3?userId=${userId}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        set({ signedUrls: data.urls });
        set({ nextContinuationToken: data.NextContinuationToken });
        set({ isTruncated: data.IsTruncated });
      });
  },
  updateFileUrls: (isFetchingRef, userId, isRecentlyDeletedPage) => {
    isFetchingRef.current = true;
    const continuationToken = get().nextContinuationToken;
    const encodedToken = encodeURIComponent(continuationToken ?? '');
    const url = isRecentlyDeletedPage
      ? `/api/aws/s3?userId=${userId}&continuationToken=${encodedToken}&isDeleted=true`
      : `/api/aws/s3?userId=${userId}&continuationToken=${encodedToken}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const fileUrls = data.urls;
        const prev = get().signedUrls;
        const newSignedUrls: fileUrlsType<MediaEntryType> = {};

        // まず prev をコピー
        for (const year in prev) {
          newSignedUrls[year] = {};
          for (const month in prev[year]) {
            newSignedUrls[year][month] = [...prev[year][month]];
          }
        }

        // fileUrls をマージ
        for (const year in fileUrls) {
          if (!newSignedUrls[year]) newSignedUrls[year] = {};

          for (const month in fileUrls[year]) {
            if (!newSignedUrls[year][month]) {
              newSignedUrls[year][month] = [...fileUrls[year][month]];
            } else {
              newSignedUrls[year][month] = [...newSignedUrls[year][month], ...fileUrls[year][month]];
            }
          }
        }
        set({
          signedUrls: newSignedUrls,
          nextContinuationToken: data.NextContinuationToken,
          isTruncated: data.IsTruncated,
        });
      })
      .finally(() => {
        isFetchingRef.current = false;
      });
  },
  reset: () => set({ signedUrls: {} }),
}));
