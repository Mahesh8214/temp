
import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DriveGrid from '../components/DriveGrid';
import Breadcrumbs from '../components/Breadcrumbs';
import { useDrive } from '../contexts/DriveContext';
import UploadManager from '../components/UploadManager';

const Dashboard: React.FC = () => {
  const { breadcrumbs, loading } = useDrive();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-drive-gray-100 dark:bg-drive-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Breadcrumbs path={breadcrumbs} />
          <div className="mt-4">
            {loading ? <GridSkeleton /> : <DriveGrid />}
          </div>
        </main>
      </div>
      <UploadManager />
    </div>
  );
};

const GridSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-drive-gray-300 dark:bg-drive-gray-800 rounded-lg h-24 w-full"></div>
        <div className="bg-drive-gray-300 dark:bg-drive-gray-800 rounded mt-2 h-4 w-3/4"></div>
      </div>
    ))}
  </div>
);

export default Dashboard;
