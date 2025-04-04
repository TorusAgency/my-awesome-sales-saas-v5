import React, { useState, useEffect, useRef } from 'react'; 
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { LeadsTable } from './components/LeadsTable';
import { DashboardMetrics } from './components/DashboardMetrics';
import { CallsView } from './components/CallsView';
import { SettingsView } from './components/SettingsView'; 
import { ConversionView } from './components/ConversionView'; 
import { SalesTrainingView } from './components/SalesTrainingView'; 
import { DateRangeFilter } from './components/DateRangeFilter'; 
import { AgendaView } from './components/AgendaView'; 
import { OpportunitiesView } from './components/OpportunitiesView'; 
import { ProspectionView } from './components/ProspectionView'; 
import { Menu, UserCircle, Settings, LogOut, LogIn, User as UserIcon, Moon, Sun } from 'lucide-react'; 
import type { Lead, SearchHistory } from './types';

// Mock data for demonstration - Added more closed leads
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 555-0123',
    company: 'Tech Corp',
    score: 85,
    status: 'qualified', 
    lastContact: new Date('2024-03-10'),
    source: 'Website',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 555-0124',
    company: 'Design Co',
    score: 65,
    status: 'contacted',
    lastContact: new Date('2024-03-12'),
    source: 'LinkedIn',
    createdAt: new Date('2024-03-01'),
  },
   { 
    id: '3',
    name: 'Mike Davis',
    email: 'mike@example.com',
    phone: '+1 555-0125',
    company: 'Innovate Ltd',
    score: 95,
    status: 'closed won', // WON
    lastContact: new Date('2024-03-05'),
    source: 'Referral',
    createdAt: new Date('2024-01-20'),
  },
   { 
    id: '4',
    name: 'Emily White',
    email: 'emily@example.com',
    phone: '+1 555-0126',
    company: 'Solutions Inc',
    score: 70,
    status: 'closed lost', // LOST
    lastContact: new Date('2024-03-15'),
    source: 'Website',
    createdAt: new Date('2024-02-28'),
  },
   { 
    id: '5',
    name: 'David Lee',
    email: 'david@example.com',
    phone: '+1 555-0127',
    company: 'Global LLC',
    score: 50,
    status: 'new',
    lastContact: new Date('2024-03-18'),
    source: 'Cold Call',
    createdAt: new Date('2024-03-18'),
  },
   { 
    id: '6',
    name: 'Laura Chen',
    email: 'laura@example.com',
    phone: '+1 555-0128',
    company: 'Startup X',
    score: 75,
    status: 'proposal sent',
    lastContact: new Date('2024-03-16'),
    source: 'Referral',
    createdAt: new Date('2024-03-02'),
  },
  // --- Added More Closed Leads ---
  { 
    id: '7',
    name: 'Robert Green',
    email: 'robert@example.com',
    phone: '+1 555-0129',
    company: 'Enterprise Solutions',
    score: 88,
    status: 'closed won', // WON
    lastContact: new Date('2024-03-14'),
    source: 'LinkedIn',
    createdAt: new Date('2024-02-10'),
  },
  { 
    id: '8',
    name: 'Linda Blue',
    email: 'linda@example.com',
    phone: '+1 555-0130',
    company: 'Creative Agency',
    score: 60,
    status: 'closed lost', // LOST
    lastContact: new Date('2024-03-11'),
    source: 'Website',
    createdAt: new Date('2024-03-05'),
  },
   { 
    id: '9',
    name: 'Kevin Black',
    email: 'kevin@example.com',
    phone: '+1 555-0131',
    company: 'Tech Corp', // Same as John Smith
    score: 92,
    status: 'closed won', // WON
    lastContact: new Date('2024-03-19'),
    source: 'Referral',
    createdAt: new Date('2024-03-01'),
  },
   { 
    id: '10',
    name: 'Jessica Grey',
    email: 'jessica@example.com',
    phone: '+1 555-0132',
    company: 'Innovate Ltd', // Same as Mike Davis
    score: 45,
    status: 'closed lost', // LOST
    lastContact: new Date('2024-03-20'),
    source: 'Cold Call',
    createdAt: new Date('2024-03-15'),
  },
  // --- End Added Leads ---
];
const mockSearchHistory: SearchHistory[] = [ /* ... existing mock data ... */ ];

// Helper to get default date range
const getDefaultDateRange = (): [Date, Date] => { 
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30); // Default to last 30 days
  return [startDate, endDate];
};

// Placeholder component for unhandled views - Restored Implementation
const PlaceholderView = ({ viewName }: { viewName: string }) => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700">
    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Placeholder: {viewName}</h2>
    <p className="mt-2 text-gray-500 dark:text-gray-400">This view ({viewName}) has not been implemented yet.</p>
  </div>
);


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); 
  const [[startDate, endDate], setDateRange] = useState<[Date, Date]>(getDefaultDateRange()); 
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); 
  const profileDropdownRef = useRef<HTMLDivElement>(null); 

  // --- Placeholder Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(true); 
  // --- End Placeholder Auth State ---

  // --- Dark Mode State & Toggle ---
   const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
       return localStorage.getItem('darkMode') === 'true' || 
              (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  // --- End Dark Mode State & Toggle ---

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => { /* ... */ };
  const handleSort = (sort: { field: keyof Lead; direction: 'asc' | 'desc' }) => { /* ... */ };
  const handleBulkAction = (action: string, leadIds: string[]) => { /* ... */ };
  
  const handleDateChange = (start: Date, end: Date) => { 
    setDateRange([start, end]);
    console.log('Date range changed in App:', start, end);
    // In a real app, this might trigger API calls to refetch data for the new range
  };

  // Navigation Handler for Dropdown
  const handleDropdownNavigate = (view: string) => {
    setCurrentView(view);
    setIsProfileDropdownOpen(false);
  };

  // Placeholder Auth Handlers
  const handleLogin = () => { /* ... */ };
  const handleLogout = () => { /* ... */ };

  // Function to render the current view based on state
  const renderCurrentView = () => {
    // Simple routing based on the view string
    if (currentView === 'dashboard') {
       return (
          <div className="space-y-6">
            <DateRangeFilter 
              startDate={startDate} 
              endDate={endDate} 
              onDateChange={handleDateChange} 
            />
            {/* Pass startDate and endDate to DashboardMetrics */}
            <DashboardMetrics 
              onNavigate={setCurrentView} 
              startDate={startDate} 
              endDate={endDate} 
            />
          </div>
        );
    }
    if (currentView === 'agenda') { 
       return <AgendaView />;
    }
     if (currentView === 'opportunities') { 
       return <OpportunitiesView leads={mockLeads} />;
    }
    if (currentView === 'leads') {
       return <LeadsTable leads={mockLeads} onSort={handleSort} onBulkAction={handleBulkAction} onNavigate={setCurrentView} />;
    }
    if (currentView === 'calls') {
       return <CallsView onNavigate={setCurrentView} />;
    }
     if (currentView === 'conversion' || currentView === 'deals/conversions') { 
       return <ConversionView leads={mockLeads} />; 
    }
     if (currentView === 'salesTraining' || currentView.startsWith('salesTraining/')) { 
       return <SalesTrainingView leads={mockLeads} />; 
    }
    if (currentView === 'settings') {
       return <SettingsView />;
    }
    if (currentView === 'prospection') {
        return <ProspectionView />; 
    }
    
    // Fallback for other sub-views
    if (currentView.startsWith('prospection/') || 
        currentView.startsWith('automations/') || 
        currentView.startsWith('callPlanning/') || 
        currentView === 'deals/proposals' || 
        currentView === 'analytics') {
       return <PlaceholderView viewName={currentView} />;
    }

    // Default fallback to dashboard
    return (
       <div className="space-y-6">
        <DateRangeFilter 
          startDate={startDate} 
          endDate={endDate} 
          onDateChange={handleDateChange} 
        />
        <DashboardMetrics 
          onNavigate={setCurrentView} 
          startDate={startDate} 
          endDate={endDate} 
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex text-gray-900 dark:text-gray-100"> 
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        currentView={currentView}
        onNavigate={setCurrentView} 
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30 border-b border-gray-200 dark:border-gray-700"> 
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Search Bar */}
              <div className="flex-1 ml-4 md:ml-0">
                <SearchBar
                  recentLeads={mockLeads}
                  searchHistory={mockSearchHistory}
                  onSearch={handleSearch}
                />
              </div>

              {/* Profile Dropdown */}
              <div className="ml-4 relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                  id="user-menu-button"
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <UserCircle className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                </button>

                {/* Dropdown Panel */}
                {isProfileDropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-gray-700"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    {isAuthenticated && (
                      <button
                        onClick={() => handleDropdownNavigate('profile')} 
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem" tabIndex={-1} id="user-menu-item-0"
                      >
                         <UserIcon className="mr-2 h-4 w-4" /> Profile
                      </button>
                    )}
                    <button
                      onClick={() => handleDropdownNavigate('settings')}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem" tabIndex={-1} id="user-menu-item-1"
                    >
                       <Settings className="mr-2 h-4 w-4" /> Settings
                    </button>
                     <button
                      onClick={toggleDarkMode}
                      className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem" tabIndex={-1} id="user-menu-item-2"
                    >
                       <span className="flex items-center">
                         {isDarkMode ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                         Dark Mode
                       </span>
                       <span className={`text-xs ${isDarkMode ? 'text-indigo-400' : 'text-gray-500'}`}>
                         {isDarkMode ? 'On' : 'Off'}
                       </span>
                    </button>
                    {isAuthenticated ? (
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem" tabIndex={-1} id="user-menu-item-3"
                      >
                         <LogOut className="mr-2 h-4 w-4" /> Log out
                      </button>
                    ) : (
                       <button
                        onClick={handleLogin}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem" tabIndex={-1} id="user-menu-item-4"
                      >
                         <LogIn className="mr-2 h-4 w-4" /> Log in
                      </button>
                    )}
                  </div>
                )}
              </div>
              {/* End Profile Dropdown */}

            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8"> 
          <div className="max-w-7xl mx-auto">
            {renderCurrentView()} 
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
