
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface DriveFile {
  id: string;
  name: string;
  parentId: string | null;
  ownerId: string;
  url: string;
  size: number;
  type: string;
  createdAt: number; // timestamp
}

export interface DriveFolder {
  id: string;
  name:string;
  parentId: string | null;
  ownerId: string;
  createdAt: number; // timestamp
}

export interface Breadcrumb {
  id: string;
  name: string;
}

export interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  error: string | null;
  isComplete: boolean;
}
