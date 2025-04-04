import React from 'react';
import { CalendarDays } from 'lucide-react'; // Using CalendarDays for title

export function AgendaView() {

  const handleConnectGoogleCalendar = () => {
    // TODO: Implement Google Calendar OAuth flow and API connection
    console.log("Connect to Google Calendar button clicked");
    alert("Google Calendar integration not implemented yet.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <CalendarDays className="h-8 w-8 mr-3 text-indigo-600" />
          Agenda
        </h1>
        <button 
          onClick={handleConnectGoogleCalendar}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {/* You might want a Google specific icon here if available */}
          Connect to Google Calendar
        </button>
      </div>

      {/* Calendar Placeholder */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <CalendarDays className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            Dynamic Calendar Component Placeholder
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            (Requires integration with a calendar library like FullCalendar or React Big Calendar)
          </p>
        </div>
      </div>
    </div>
  );
}
