
import React, { useState } from 'react';
import { DriveFile } from '../types';
import { FileIcon } from './FileIcon';
import { useDrive } from '../contexts/DriveContext';

interface FileItemProps {
  file: DriveFile;
}

const FileItem: React.FC<FileItemProps> = ({ file }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const { deleteFile, renameFile } = useDrive();

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}#/shared/${file.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Share link copied to clipboard!');
    }, (err) => {
        alert('Failed to copy link.');
        console.error('Could not copy text: ', err);
    });
    setMenuOpen(false);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm(`Are you sure you want to delete "${file.name}"?`)){
        deleteFile(file.id);
    }
    setMenuOpen(false);
  };
  
  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
    setMenuOpen(false);
  };
  
  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (newName.trim() && newName !== file.name) {
      renameFile(file.id, newName.trim());
    }
    setIsRenaming(false);
  };


  return (
    <div className="relative group flex flex-col bg-white dark:bg-drive-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-transparent hover:border-blue-500 overflow-hidden">
        <div className="flex-grow flex items-center justify-center p-4 bg-drive-gray-50 dark:bg-drive-gray-800/50">
            {file.type.startsWith('image/') ? (
                <img src={file.url} alt={file.name} className="max-h-24 object-contain" />
            ) : (
                <FileIcon fileType={file.type} className="h-16 w-16" />
            )}
        </div>
        <div className="p-3 flex items-center space-x-2">
            <FileIcon fileType={file.type} className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                {isRenaming ? (
                    <form onSubmit={handleRenameSubmit}>
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onBlur={handleRenameSubmit}
                          autoFocus
                          className="w-full bg-transparent text-sm font-medium text-drive-gray-800 dark:text-drive-gray-200 outline-none p-0 border-b-2 border-blue-500"
                          onClick={e => e.stopPropagation()}
                        />
                    </form>
                ) : (
                    <p className="text-sm font-medium text-drive-gray-800 dark:text-drive-gray-200 truncate" title={file.name}>{file.name}</p>
                )}
                <p className="text-xs text-drive-gray-500 dark:text-drive-gray-400">{formatBytes(file.size)}</p>
            </div>
        </div>

        <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} className="absolute top-2 right-2 p-1 rounded-full hover:bg-drive-gray-200 dark:hover:bg-drive-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-drive-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
        </button>
        {menuOpen && (
            <div className="absolute top-8 right-2 w-48 bg-white dark:bg-drive-gray-800 rounded-md shadow-lg py-1 z-10">
                <a href={file.url} download={file.name} onClick={(e) => e.stopPropagation()} className="block px-4 py-2 text-sm text-drive-gray-700 dark:text-drive-gray-200 hover:bg-drive-gray-100 dark:hover:bg-drive-gray-700">Download</a>
                <button onClick={handleShare} className="w-full text-left px-4 py-2 text-sm text-drive-gray-700 dark:text-drive-gray-200 hover:bg-drive-gray-100 dark:hover:bg-drive-gray-700">Share</button>
                <button onClick={handleRename} className="w-full text-left px-4 py-2 text-sm text-drive-gray-700 dark:text-drive-gray-200 hover:bg-drive-gray-100 dark:hover:bg-drive-gray-700">Rename</button>
                <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-drive-gray-100 dark:hover:bg-drive-gray-700">Delete</button>
            </div>
        )}
    </div>
  );
};

export default FileItem;
