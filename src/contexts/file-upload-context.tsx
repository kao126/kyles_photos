'use client';
import { createContext, useContext } from 'react';
import { useFileUploadLogic } from '@/hooks/use-upload-files';

type FileUploadContextType = ReturnType<typeof useFileUploadLogic>;

const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

export const FileUploadProvider = ({ children }: { children: React.ReactNode }) => {
  const uploadLogic = useFileUploadLogic();
  return <FileUploadContext.Provider value={uploadLogic}>{children}</FileUploadContext.Provider>;
};

export const useFileUpload = () => {
  const context = useContext(FileUploadContext);
  if (!context) throw new Error('useFileUpload must be used within FileUploadProvider');
  return context;
};
