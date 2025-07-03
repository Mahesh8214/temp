
import React from 'react';
import { useDrive } from '../contexts/DriveContext';
import FolderItem from './FolderItem';
import FileItem from './FileItem';

const DriveGrid: React.FC = () => {
  const { folders, files } = useDrive();

  const hasContent = folders.length > 0 || files.length > 0;

  return (
    <div>
      {folders.length > 0 && (
        <>
          <h2 className="text-lg font-medium text-drive-gray-800 dark:text-drive-gray-200 mb-3">Folders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {folders.map(folder => (
              <FolderItem key={folder.id} folder={folder} />
            ))}
          </div>
        </>
      )}

      {files.length > 0 && (
         <>
          <h2 className="text-lg font-medium text-drive-gray-800 dark:text-drive-gray-200 mt-6 mb-3">Files</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {files.map(file => (
              <FileItem key={file.id} file={file} />
            ))}
          </div>
        </>
      )}
      
      {!hasContent && (
        <div className="text-center py-16">
            <svg className="mx-auto h-24 w-24 text-drive-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-drive-gray-900 dark:text-drive-gray-200">Empty Folder</h3>
            <p className="mt-1 text-sm text-drive-gray-500 dark:text-drive-gray-400">Drag and drop files here or use the "New" button.</p>
        </div>
      )}
    </div>
  );
};

export default DriveGrid;
