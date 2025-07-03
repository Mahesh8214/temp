
import { UserProfile, DriveFile, DriveFolder, Breadcrumb } from '../types';
import { ROOT_FOLDER_ID, ROOT_FOLDER_NAME } from '../constants';

// --- MOCK DATABASE ---
let mockUser: UserProfile | null = null;
let mockFolders: DriveFolder[] = [
  { id: 'folder1', name: 'Work Documents', parentId: ROOT_FOLDER_ID, ownerId: 'user1', createdAt: Date.now() - 200000 },
  { id: 'folder2', name: 'Vacation Photos', parentId: ROOT_FOLDER_ID, ownerId: 'user1', createdAt: Date.now() - 300000 },
  { id: 'folder3', name: 'Project X', parentId: 'folder1', ownerId: 'user1', createdAt: Date.now() - 100000 },
];
let mockFiles: DriveFile[] = [
  { id: 'file1', name: 'quarterly-report.pdf', parentId: 'folder1', ownerId: 'user1', url: '#', size: 1234567, type: 'application/pdf', createdAt: Date.now() - 150000 },
  { id: 'file2', name: 'logo.png', parentId: ROOT_FOLDER_ID, ownerId: 'user1', url: 'https://picsum.photos/200', size: 87654, type: 'image/png', createdAt: Date.now() - 500000 },
  { id: 'file3', name: 'beach.jpg', parentId: 'folder2', ownerId: 'user1', url: 'https://picsum.photos/200/300', size: 2345678, type: 'image/jpeg', createdAt: Date.now() - 250000 },
];
// --- END MOCK DATABASE ---

// Helper function to simulate network delay
const delay = <T,>(ms: number, value: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value), ms));

// =================================================================
// AUTHENTICATION SERVICE
// In a real app, this would use `firebase/auth`
// =================================================================
export const authService = {
  signIn: async (email: string, pass: string): Promise<UserProfile> => {
    console.log(`(MOCK) Signing in with ${email}`);
    if (email === 'test@example.com' && pass === 'password') {
      const user: UserProfile = { uid: 'user1', email, displayName: 'Test User', photoURL: `https://i.pravatar.cc/150?u=${email}` };
      mockUser = user;
      return delay(500, user);
    }
    return Promise.reject(new Error('Invalid credentials'));
  },
  signOut: async (): Promise<void> => {
    console.log('(MOCK) Signing out');
    mockUser = null;
    return delay(200, undefined);
  },
  getCurrentUser: async (): Promise<UserProfile | null> => {
    console.log('(MOCK) Checking current user');
    return delay(100, mockUser);
  }
};

// =================================================================
// FILE & FOLDER SERVICE
// In a real app, this would use `firebase/firestore` and `firebase/storage`
// =================================================================
export const fileService = {
  getFolderContents: async (folderId: string): Promise<{ files: DriveFile[], folders: DriveFolder[] }> => {
    console.log(`(MOCK) Fetching contents for folder: ${folderId}`);
    if (folderId !== ROOT_FOLDER_ID && !mockFolders.find(f => f.id === folderId)) {
      return Promise.reject(new Error("Folder not found"));
    }
    const folders = mockFolders.filter(f => f.parentId === folderId);
    const files = mockFiles.filter(f => f.parentId === folderId);
    return delay(400, { files, folders });
  },

  createFolder: async (name: string, parentId: string, ownerId: string): Promise<DriveFolder> => {
    console.log(`(MOCK) Creating folder "${name}" in ${parentId}`);
    const newFolder: DriveFolder = {
      id: `folder${Date.now()}`,
      name,
      parentId,
      ownerId,
      createdAt: Date.now(),
    };
    mockFolders.push(newFolder);
    return delay(300, newFolder);
  },
  
  uploadFile: async (file: File, parentId: string, ownerId: string, onProgress: (progress: number) => void): Promise<DriveFile> => {
    console.log(`(MOCK) Uploading file "${file.name}" to ${parentId}`);
    // Simulate upload progress
    for (let p of [10, 30, 50, 75, 90, 100]) {
      await delay(200, undefined);
      onProgress(p);
    }

    const newFile: DriveFile = {
        id: `file${Date.now()}`,
        name: file.name,
        parentId,
        ownerId,
        url: URL.createObjectURL(file), // temporary local URL
        size: file.size,
        type: file.type,
        createdAt: Date.now(),
    };
    mockFiles.push(newFile);
    return newFile;
  },

  deleteFile: async (fileId: string): Promise<void> => {
    console.log(`(MOCK) Deleting file ${fileId}`);
    mockFiles = mockFiles.filter(f => f.id !== fileId);
    return delay(300, undefined);
  },

  deleteFolder: async (folderId: string): Promise<void> => {
    console.log(`(MOCK) Deleting folder ${folderId}`);
    // This would need to be a recursive delete in a real implementation
    mockFolders = mockFolders.filter(f => f.id !== folderId);
    mockFiles = mockFiles.filter(f => f.parentId !== folderId);
    return delay(300, undefined);
  },

  renameFile: async (fileId: string, newName: string): Promise<void> => {
    console.log(`(MOCK) Renaming file ${fileId} to ${newName}`);
    const file = mockFiles.find(f => f.id === fileId);
    if(file) file.name = newName;
    return delay(200, undefined);
  },
  
  renameFolder: async (folderId: string, newName: string): Promise<void> => {
    console.log(`(MOCK) Renaming folder ${folderId} to ${newName}`);
    const folder = mockFolders.find(f => f.id === folderId);
    if(folder) folder.name = newName;
    return delay(200, undefined);
  },
  
  getBreadcrumbs: async (folderId: string): Promise<Breadcrumb[]> => {
      if (folderId === ROOT_FOLDER_ID) {
          return [{ id: ROOT_FOLDER_ID, name: ROOT_FOLDER_NAME }];
      }
      
      const path: Breadcrumb[] = [];
      let currentId: string | null = folderId;

      while(currentId && currentId !== ROOT_FOLDER_ID) {
          const folder = mockFolders.find(f => f.id === currentId);
          if (folder) {
              path.unshift({ id: folder.id, name: folder.name });
              currentId = folder.parentId;
          } else {
              currentId = null; // folder not found, break
          }
      }
      path.unshift({ id: ROOT_FOLDER_ID, name: ROOT_FOLDER_NAME });
      return delay(50, path);
  },

  getSharedFile: async (fileId: string): Promise<DriveFile | null> => {
    console.log(`(MOCK) Fetching shared file ${fileId}`);
    const file = mockFiles.find(f => f.id === fileId);
    return delay(300, file || null);
  }
};
