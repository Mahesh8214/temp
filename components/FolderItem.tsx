
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DriveFolder } from '../types';
import { useDrive } from '../contexts/DriveContext';

interface FolderItemProps {
  folder: DriveFolder;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder }) => {
  const navigate = useNavigate();
  const { deleteFolder, renameFolder } = useDrive();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);

  const handleNavigate = () => {
    if(!isRenaming) {
        navigate(`/folder/${folder.id}`);
    }
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm(`Are you sure you want to delete "${folder.name}"?`)){
        deleteFolder(folder.id);
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
    if (newName.trim() && newName !== folder.name) {
      renameFolder(folder.id, newName.trim());
    }
    setIsRenaming(false);
  };

  return (
    <div
      onDoubleClick={handleNavigate}
      className="relative group p-3 bg-white dark:bg-drive-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-blue-500"
    >
      <div className="flex items-center space-x-3">
        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
        {isRenaming ? (
          <form onSubmit={handleRenameSubmit} className="flex-1">
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
          <span className="text-sm font-medium text-drive-gray-800 dark:text-drive-gray-200 truncate">{folder.name}</span>
        )}
      </div>
       <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} className="absolute top-2 right-2 p-1 rounded-full hover:bg-drive-gray-200 dark:hover:bg-drive-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-drive-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
       </button>
       {menuOpen && (
            <div className="absolute top-8 right-2 w-40 bg-white dark:bg-drive-gray-800 rounded-md shadow-lg py-1 z-10">
                <button onClick={handleRename} className="w-full text-left px-4 py-2 text-sm text-drive-gray-700 dark:text-drive-gray-200 hover:bg-drive-gray-100 dark:hover:bg-drive-gray-700">Rename</button>
                <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-drive-gray-100 dark:hover:bg-drive-gray-700">Delete</button>
            </div>
        )}
    </div>
  );
};

export default FolderItem;
