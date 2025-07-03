
import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../types';
import { ROOT_FOLDER_ID } from '../constants';

interface BreadcrumbsProps {
  path: Breadcrumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path }) => {
  return (
    <nav className="flex items-center text-sm sm:text-base" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {path.map((crumb, index) => (
          <li key={crumb.id} className="inline-flex items-center">
            {index > 0 && (
              <svg className="w-4 h-4 text-drive-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
            )}
            {index < path.length - 1 ? (
              <Link
                to={crumb.id === ROOT_FOLDER_ID ? '/' : `/folder/${crumb.id}`}
                className="text-drive-gray-700 dark:text-drive-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                {crumb.name}
              </Link>
            ) : (
              <span className="text-drive-gray-500 dark:text-drive-gray-400 font-bold" aria-current="page">
                {crumb.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
