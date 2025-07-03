
import React, { useState, useRef } from 'react';
import { useDrive } from '../contexts/DriveContext';
import CreateFolderModal from './modals/CreateFolderModal';

const Sidebar: React.FC = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const { uploadFile } = useDrive();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewFolder = () => {
    setModalOpen(true);
    setMenuOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        Array.from(e.target.files).forEach(file => uploadFile(file));
    }
    setMenuOpen(false);
  };
  
  const triggerFileUpload = () => {
      fileInputRef.current?.click();
  };
  

  return (
    <>
      <div className="w-64 bg-drive-gray-100 dark:bg-drive-gray-950 p-4 flex flex-col space-y-4 border-r border-drive-gray-200 dark:border-drive-gray-800">
        <div className="flex items-center space-x-2 p-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            <span className="text-xl font-bold">React Drive</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="w-full flex items-center justify-center bg-white dark:bg-drive-gray-800 text-drive-gray-800 dark:text-drive-gray-200 shadow-md hover:shadow-lg rounded-full px-5 py-3 transition-all"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            New
          </button>
          {isMenuOpen && (
            <div className="absolute top-full mt-2 w-48 bg-white dark:bg-drive-gray-800 rounded-lg shadow-xl py-2 z-10">
              <button onClick={handleNewFolder} className="w-full text-left px-4 py-2 text-sm text-drive-gray-700 dark:text-drive-gray-200 hover:bg-drive-gray-100 dark:hover:bg-drive-gray-700 flex items-center">
                 <svg className="w-5 h-5 mr-3 text-drive-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
                 New Folder
              </button>
              <button onClick={triggerFileUpload} className="w-full text-left px-4 py-2 text-sm text-drive-gray-700 dark:text-drive-gray-200 hover:bg-drive-gray-100 dark:hover:bg-drive-gray-700 flex items-center">
                 <svg className="w-5 h-5 mr-3 text-drive-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                 File Upload
              </button>
               <input type="file" multiple onChange={handleFileUpload} ref={fileInputRef} className="hidden" />
            </div>
          )}
        </div>
        <nav className="flex-1 space-y-1">
          <a href="#/" className="flex items-center px-4 py-2 text-sm font-medium text-drive-gray-900 dark:text-white bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            My Drive
          </a>
           <a href="#/shared-with-me" className="flex items-center px-4 py-2 text-sm font-medium text-drive-gray-700 dark:text-drive-gray-300 hover:bg-drive-gray-200 dark:hover:bg-drive-gray-800 rounded-lg">
            Shared with me
          </a>
        </nav>
      </div>
      <CreateFolderModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Sidebar;
