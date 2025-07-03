
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DriveFile } from '../types';
import { fileService } from '../services/firebaseService';
import { FileIcon } from '../components/FileIcon';

const SharedFilePage: React.FC = () => {
    const { fileId } = useParams<{ fileId: string }>();
    const [file, setFile] = useState<DriveFile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFile = async () => {
            if (!fileId) {
                setError('No file ID provided.');
                setLoading(false);
                return;
            }
            try {
                const fetchedFile = await fileService.getSharedFile(fileId);
                if (fetchedFile) {
                    setFile(fetchedFile);
                } else {
                    setError('File not found or access denied.');
                }
            } catch (err) {
                setError('An error occurred while fetching the file.');
            } finally {
                setLoading(false);
            }
        };
        fetchFile();
    }, [fileId]);
    
    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };


    if (loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-drive-gray-100 dark:bg-drive-gray-950">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-drive-gray-100 dark:bg-drive-gray-950">
                <div className="text-center p-8 bg-white dark:bg-drive-gray-900 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
                    <p className="text-drive-gray-700 dark:text-drive-gray-300">{error}</p>
                </div>
            </div>
        );
    }

    if (!file) {
        return null;
    }

    return (
        <div className="min-h-screen bg-drive-gray-100 dark:bg-drive-gray-950 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white dark:bg-drive-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex-shrink-0">
                           <FileIcon fileType={file.type} className="h-12 w-12" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-drive-gray-900 dark:text-white break-all">{file.name}</h1>
                            <p className="text-sm text-drive-gray-500 dark:text-drive-gray-400">Shared for public access</p>
                        </div>
                    </div>
                    
                    {file.type.startsWith('image/') && (
                        <div className="mb-6 rounded-lg overflow-hidden bg-drive-gray-200 dark:bg-drive-gray-800">
                            <img src={file.url} alt={file.name} className="w-full h-auto max-h-96 object-contain" />
                        </div>
                    )}

                    <div className="bg-drive-gray-100 dark:bg-drive-gray-800 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-drive-gray-600 dark:text-drive-gray-400">File Size</span>
                            <span className="font-medium text-drive-gray-800 dark:text-drive-gray-200">{formatBytes(file.size)}</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-drive-gray-600 dark:text-drive-gray-400">File Type</span>
                            <span className="font-medium text-drive-gray-800 dark:text-drive-gray-200">{file.type}</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-drive-gray-600 dark:text-drive-gray-400">Uploaded</span>
                            <span className="font-medium text-drive-gray-800 dark:text-drive-gray-200">{new Date(file.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-drive-gray-50 dark:bg-drive-gray-800/50 p-6">
                     <a
                        href={file.url}
                        download={file.name}
                        className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-drive-gray-50 dark:focus:ring-offset-drive-gray-800 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Download
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SharedFilePage;
