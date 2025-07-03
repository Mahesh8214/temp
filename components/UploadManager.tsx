
import React from 'react';
import { useDrive } from '../contexts/DriveContext';
import { UploadingFile } from '../types';
import { FileIcon } from './FileIcon';

const UploadManager: React.FC = () => {
  const { uploadingFiles } = useDrive();

  if (uploadingFiles.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-drive-gray-900 rounded-lg shadow-2xl z-50">
      <div className="p-3 border-b border-drive-gray-200 dark:border-drive-gray-700">
        <h3 className="text-sm font-medium text-drive-gray-900 dark:text-drive-gray-100">
          {uploadingFiles.filter(f => f.isComplete).length} of {uploadingFiles.length} uploads complete
        </h3>
      </div>
      <div className="p-2 space-y-2 max-h-64 overflow-y-auto">
        {uploadingFiles.map(file => (
          <UploadItem key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
};

const UploadItem: React.FC<{ file: UploadingFile }> = ({ file }) => {
  return (
    <div className="p-2 rounded-md hover:bg-drive-gray-100 dark:hover:bg-drive-gray-800">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {file.isComplete ? (
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
          ) : file.error ? (
             <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </div>
          ) : (
             <FileIcon fileType={file.name.split('.').pop() || ''} className="h-8 w-8" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-drive-gray-800 dark:text-drive-gray-200 truncate">{file.name}</p>
          <p className="text-xs text-drive-gray-500 dark:text-drive-gray-400">{file.error || (file.isComplete ? 'Complete' : `Uploading... ${file.progress}%`)}</p>
        </div>
      </div>
      {!file.isComplete && !file.error && (
        <div className="mt-2 w-full bg-drive-gray-200 dark:bg-drive-gray-700 rounded-full h-1.5">
          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${file.progress}%` }}></div>
        </div>
      )}
    </div>
  );
}

export default UploadManager;
