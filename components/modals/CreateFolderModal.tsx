
import React, { useState } from 'react';
import { useDrive } from '../../contexts/DriveContext';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ isOpen, onClose }) => {
  const [folderName, setFolderName] = useState('Untitled folder');
  const { createFolder } = useDrive();
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(folderName.trim()){
      createFolder(folderName.trim());
    }
    onClose();
    setFolderName('Untitled folder');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white dark:bg-drive-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-medium text-drive-gray-900 dark:text-drive-gray-100 mb-4">New folder</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            autoFocus
            onFocus={(e) => e.target.select()}
            className="w-full px-3 py-2 border border-drive-gray-300 dark:border-drive-gray-600 rounded-md bg-transparent text-drive-gray-900 dark:text-drive-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-drive-gray-700 dark:text-drive-gray-200 bg-transparent hover:bg-drive-gray-100 dark:hover:bg-drive-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;
