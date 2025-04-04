import React from 'react';
import { X } from 'lucide-react';

interface TimelineItemDetailsProps {
  item: any; // Replace 'any' with a specific TimelineItem type later
  onClose: () => void;
}

export function TimelineItemDetails({ item, onClose }: TimelineItemDetailsProps) {

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-50 overflow-y-auto flex justify-center items-start pt-10">
      {/* Modal Container */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Timeline Event Details</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.title} on {item.date}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close details"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto text-gray-700 dark:text-gray-300">
          <p><span className="font-semibold text-gray-900 dark:text-white">Type:</span> {item.type}</p>
          <p><span className="font-semibold text-gray-900 dark:text-white">Description:</span> {item.description}</p>
          
          {/* Placeholder Sections */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Associated Notes (Placeholder)</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">No notes available or fetch required.</p>
          </div>

          {(item.type === 'call' || item.type === 'meeting') && (
             <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600">
               <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Transcript (Placeholder)</h4>
               <p className="text-sm text-gray-600 dark:text-gray-400 italic">Transcript not available or fetch required.</p>
             </div>
          )}

          {item.type === 'email' && (
             <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600">
               <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Email Content (Placeholder)</h4>
               <p className="text-sm text-gray-600 dark:text-gray-400 italic">Email content not available or fetch required.</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
