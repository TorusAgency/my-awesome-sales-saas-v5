import React from 'react';
import { Columns, DollarSign, User } from 'lucide-react'; // Import necessary icons
import type { Lead } from '../types';

interface OpportunitiesViewProps {
  leads: Lead[];
}

// Define the Kanban stages based on the updated Lead status type
const kanbanStages: Lead['status'][] = [
  'new', 
  'contacted', 
  'qualified', 
  'proposal sent', 
  'negotiation', 
  'closed won', 
  'closed lost'
];

// Helper to format status names for display
const formatStatusName = (status: string): string => {
  return status
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function OpportunitiesView({ leads }: OpportunitiesViewProps) {

  // Group leads by status
  const leadsByStatus = kanbanStages.reduce((acc, status) => {
    acc[status] = leads.filter(lead => lead.status === status);
    return acc;
  }, {} as Record<Lead['status'], Lead[]>);

  // Placeholder for drag-and-drop handling
  const handleDragEnd = (result: any) => {
    // TODO: Implement drag-and-drop logic using a library like react-beautiful-dnd or dnd-kit
    // This would involve:
    // 1. Updating the local state of leadsByStatus optimistically.
    // 2. Calling an API to update the lead's status in the backend.
    // 3. Handling potential errors and reverting state if the API call fails.
    console.log('Drag ended:', result);
    alert('Drag-and-drop functionality requires a library and backend integration.');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
        <Columns className="h-8 w-8 mr-3 text-indigo-600" />
        Opportunities Kanban
      </h1>

      {/* Kanban Board Container */}
      {/* NOTE: This needs horizontal scrolling on smaller screens */}
      <div className="flex space-x-4 overflow-x-auto pb-4"> 
        {/* TODO: Wrap with DragDropContext from react-beautiful-dnd */}
        
        {kanbanStages.map((stage) => (
          <div key={stage} className="flex-shrink-0 w-72 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
            {/* Column Header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                {formatStatusName(stage)} 
                <span className="ml-2 text-gray-500 dark:text-gray-400 font-normal">
                  ({leadsByStatus[stage]?.length || 0})
                </span>
              </h2>
            </div>

            {/* Column Body (Droppable Area) */}
            {/* TODO: Wrap with <Droppable droppableId={stage}> */}
            <div className="p-3 space-y-3 overflow-y-auto h-[calc(100vh-250px)]"> {/* Adjust height as needed */}
              {(leadsByStatus[stage] || []).map((lead, index) => (
                // TODO: Wrap with <Draggable draggableId={lead.id} index={index}>
                <div 
                  key={lead.id} 
                  className="bg-white dark:bg-gray-800 p-3 rounded-md shadow border border-gray-200 dark:border-gray-600 cursor-grab" // Added cursor-grab
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{lead.company}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" /> 
                      {/* Placeholder for value - add MRR/NRR if needed */}
                      ${(lead.score * 100).toLocaleString()} {/* Example value */}
                    </span>
                    <span className="flex items-center">
                       <User className="h-3 w-3 mr-1" /> 
                       {/* Placeholder for owner */}
                       Owner
                    </span>
                  </div>
                </div>
                // TODO: Close </Draggable>
              ))}
               {/* Placeholder for Droppable */}
            </div>
             {/* TODO: Close </Droppable> */}
          </div>
        ))}
         {/* TODO: Close </DragDropContext> */}
      </div>
       <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-4">
         Note: Drag-and-drop functionality to change lead status requires integration with a drag-and-drop library (e.g., react-beautiful-dnd) and backend API calls.
       </p>
    </div>
  );
}
