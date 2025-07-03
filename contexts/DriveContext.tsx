
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DriveFile, DriveFolder, Breadcrumb, UploadingFile } from '../types';
import { fileService } from '../services/firebaseService';
import { ROOT_FOLDER_ID, ROOT_FOLDER_NAME } from '../constants';
import { useAuth } from './AuthContext';

interface DriveContextType {
  files: DriveFile[];
  folders: DriveFolder[];
  currentFolderId: string;
  breadcrumbs: Breadcrumb[];
  loading: boolean;
  createFolder: (name: string) => Promise<void>;
  uploadFile: (file: File) => void;
  uploadingFiles: UploadingFile[];
  deleteFile: (fileId: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  renameFile: (fileId: string, newName: string) => Promise<void>;
  renameFolder: (folderId: string, newName: string) => Promise<void>;
}

const DriveContext = createContext<DriveContextType | undefined>(undefined);

export const DriveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { folderId: routeFolderId } = useParams<{ folderId?: string }>();
  const currentFolderId = routeFolderId || ROOT_FOLDER_ID;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [files, setFiles] = useState<DriveFile[]>([]);
  const [folders, setFolders] = useState<DriveFolder[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([{ id: ROOT_FOLDER_ID, name: ROOT_FOLDER_NAME }]);
  const [loading, setLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);


  const fetchContents = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { files: fetchedFiles, folders: fetchedFolders } = await fileService.getFolderContents(currentFolderId);
      setFiles(fetchedFiles);
      setFolders(fetchedFolders);

      const newBreadcrumbs = await fileService.getBreadcrumbs(currentFolderId);
      setBreadcrumbs(newBreadcrumbs);
    } catch (error) {
      console.error("Failed to fetch folder contents:", error);
      navigate('/'); // on error (e.g. folder not found), go to root
    } finally {
      setLoading(false);
    }
  }, [currentFolderId, user, navigate]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const createFolder = async (name: string) => {
    if (!user) return;
    await fileService.createFolder(name, currentFolderId, user.uid);
    fetchContents(); // Refresh contents
  };
  
  const uploadFile = (file: File) => {
    if (!user) return;
    const uploadId = `${Date.now()}-${file.name}`;
    const newUploadingFile: UploadingFile = {
      id: uploadId,
      name: file.name,
      progress: 0,
      error: null,
      isComplete: false,
    };

    setUploadingFiles(prev => [...prev, newUploadingFile]);
    
    fileService.uploadFile(file, currentFolderId, user.uid, (progress) => {
      setUploadingFiles(prev => prev.map(f => f.id === uploadId ? {...f, progress} : f));
    }).then(() => {
       setUploadingFiles(prev => prev.map(f => f.id === uploadId ? {...f, progress: 100, isComplete: true} : f));
       fetchContents();
       setTimeout(() => {
           setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
       }, 5000); // Remove after 5s
    }).catch(error => {
        setUploadingFiles(prev => prev.map(f => f.id === uploadId ? {...f, error: error.message} : f));
    });
  };

  const deleteFile = async (fileId: string) => {
    await fileService.deleteFile(fileId);
    fetchContents();
  };

  const deleteFolder = async (folderId: string) => {
    await fileService.deleteFolder(folderId);
    fetchContents();
  };
  
  const renameFile = async (fileId: string, newName: string) => {
    await fileService.renameFile(fileId, newName);
    fetchContents();
  };
  
  const renameFolder = async (folderId: string, newName: string) => {
    await fileService.renameFolder(folderId, newName);
    fetchContents();
  };


  const value = { 
    files, 
    folders, 
    currentFolderId,
    breadcrumbs, 
    loading, 
    createFolder,
    uploadFile,
    uploadingFiles,
    deleteFile,
    deleteFolder,
    renameFile,
    renameFolder,
  };

  return (
    <DriveContext.Provider value={value}>
      {children}
    </DriveContext.Provider>
  );
};

export const useDrive = (): DriveContextType => {
  const context = useContext(DriveContext);
  if (context === undefined) {
    throw new Error('useDrive must be used within a DriveProvider');
  }
  return context;
};
