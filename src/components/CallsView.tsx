import React, { useState, useEffect } from 'react';
import { 
  Phone, Calendar, Clock, User, Video, Search, 
  ExternalLink, Check // Added icons for Next Meetings
} from 'lucide-react'; 
import type { Call, Meeting, CallInsights } from '../types'; 
import { CallInsightsView } from './CallInsightsView'; 

// Mock data using the new Call type
const mockCalls: Call[] = [
  {
    id: 'call-1',
    leadName: 'John Smith',
    agentName: 'Alice Brown',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    duration: '15:20',
    insights: { 
      summary: 'Discussed pricing options and next steps. John is interested but needs approval.',
      keyPoints: ['Pricing tiers explained', 'Feature comparison', 'Budget constraints mentioned'],
      actionItems: ['Send follow-up email with proposal', 'Schedule demo for technical team'],
      todoList: ['Update CRM with call notes', 'Add reminder for follow-up'],
      overallScore: 75,
      scriptAdherenceScore: 8,
      dealClosureProbability: 60,
      transcription: [
        { timestamp: '00:10', speaker: 'Agent', text: 'Hello John, thanks for taking the time.' },
        { timestamp: '00:15', speaker: 'Lead', text: 'Hi Alice, thanks for calling.' },
        { timestamp: '05:30', speaker: 'Lead', text: 'The pricing seems a bit high...' },
        { timestamp: '14:50', speaker: 'Agent', text: 'Okay, I\'ll send that proposal over.' },
      ],
    },
  },
  {
    id: 'call-2',
    leadName: 'Sarah Johnson',
    agentName: 'Bob White',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    duration: '22:05',
  },
  {
    id: 'call-3',
    leadName: 'Mike Davis',
    agentName: 'Alice Brown',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    duration: '08:55',
    insights: { 
      summary: 'Quick check-in call. Mike confirmed receipt of the proposal and will review it next week.',
      keyPoints: ['Proposal received', 'Review scheduled internally', 'No major objections raised'],
      actionItems: ['Follow up next Wednesday'],
      todoList: ['Set reminder for follow-up call'],
      overallScore: 85,
      scriptAdherenceScore: 9,
      dealClosureProbability: 70,
      transcription: [
        { timestamp: '00:05', speaker: 'Agent', text: 'Hi Mike, just checking in.' },
        { timestamp: '01:20', speaker: 'Lead', text: 'Yes, got the proposal. Looks good so far.' },
        { timestamp: '08:30', speaker: 'Agent', text: 'Great, talk to you next week then.' },
      ],
    },
  },
   {
    id: 'call-4',
    leadName: 'Sarah Johnson', // Another call with Sarah
    agentName: 'Alice Brown',
    timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000), // Yesterday
    duration: '12:15',
    insights: { 
      summary: 'Follow-up call regarding feature X. Sarah needs clarification on integration.',
      keyPoints: ['Integration process', 'API documentation', 'Security concerns addressed'],
      actionItems: ['Send API docs', 'Schedule technical follow-up'],
      todoList: ['Update lead notes', 'Coordinate with tech team'],
      overallScore: 70,
      scriptAdherenceScore: 7,
      dealClosureProbability: 55,
      transcription: [
        { timestamp: '00:10', speaker: 'Agent', text: 'Hi Sarah, following up on our last chat.' },
        { timestamp: '03:45', speaker: 'Lead', text: 'How does the integration work exactly?' },
      ],
    },
  },
];

// Mock Meeting Data - Copied from LeadProfile
const mockMeetingsData: Meeting[] = [
  {
    id: 'meet-1',
    leadName: 'John Smith',
    agentName: 'Alice Brown',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    duration: '45:00', 
    platform: 'Google Meet',
    insights: { 
      summary: 'Demo of the AI Automation Suite. John was impressed with feature Y.',
      keyPoints: ['Feature Y demo', 'Integration with existing tools discussed', 'Pricing clarification'],
      actionItems: ['Send technical documentation', 'Provide sandbox access'],
      todoList: ['Follow up on sandbox access', 'Update opportunity stage'],
      overallScore: 88,
      scriptAdherenceScore: 9, 
      dealClosureProbability: 75,
      transcription: [ 
        { timestamp: '00:00', speaker: 'Agent', text: 'Welcome John, let\'s start the demo.' },
        { timestamp: '15:30', speaker: 'Lead', text: 'How does feature Y handle large datasets?' },
        { timestamp: '44:00', speaker: 'Agent', text: 'I\'ll send over the technical docs right after this.' },
      ],
    },
  },
  {
    id: 'meet-2',
    leadName: 'Mike Davis',
    agentName: 'Alice Brown',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    duration: '30:00', 
    platform: 'Zoom',
  },
];

// Mock Next Meetings Data - Copied from LeadProfile
const mockNextMeetingsData = [
  { id: 'nm1', leadName: 'Alice Wonderland', agentName: 'Current User', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), type: 'Videoconference', status: 'To be confirmed', url: 'https://meet.google.com/xyz-abc-def' },
  { id: 'nm2', leadName: 'Bob The Builder', agentName: 'Current User', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), type: 'Call', status: 'Confirmed' },
];

// Helper function to format date - Copied from LeadProfile
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to format date and time - Copied from LeadProfile
const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};


interface CallsViewProps {
  onNavigate: (view: string) => void; 
}

export function CallsView({ onNavigate }: CallsViewProps) { 
  const [selectedItem, setSelectedItem] = useState<Call | Meeting | null>(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCalls, setFilteredCalls] = useState<Call[]>(mockCalls);
  const [nextMeetings, setNextMeetings] = useState(mockNextMeetingsData); // State for next meetings

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (!lowerCaseQuery) {
      setFilteredCalls(mockCalls); 
    } else {
      const results = mockCalls.filter(call => 
        call.leadName.toLowerCase().includes(lowerCaseQuery) ||
        call.agentName.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredCalls(results);
    }
  }, [searchQuery]); 

  const handleItemClick = (item: Call | Meeting) => {
    if (item.insights) { 
      setSelectedItem(item);
    } else {
      console.log(`Insights not available for item ${item.id}`);
    }
  };

  const handleCloseInsights = () => {
    setSelectedItem(null);
  };

  const handleNewGoogleMeeting = () => {
    console.log("Initiate new Google Meeting flow");
  };

  // --- Handlers Copied from LeadProfile ---
  const handleMeetingCall = (meeting: any) => { 
    console.log("Initiate call for meeting:", meeting.id);
    // TODO: Implement actual call initiation
  };
  const handleMeetingVideo = (meeting: any) => { 
    console.log("Open video conference for meeting:", meeting.id, meeting.url);
    if (meeting.url) {
      window.open(meeting.url, '_blank');
    }
  };
  const handleAddToCalendar = (meeting: any) => { 
    console.log("Add meeting to Google Calendar:", meeting.id);
    // TODO: Implement Google Calendar API integration
  };
  const handleConfirmMeeting = async (meetingId: string) => { 
    console.log("Requesting confirmation for meeting:", meetingId);
    // TODO: API Call - POST /api/meetings/{meetingId}/request-confirmation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setNextMeetings(prevMeetings => prevMeetings.map(m => 
      m.id === meetingId ? { ...m, status: 'Confirmation Requested' } : m 
    ));
    console.log("Confirmation request sent (simulated).");
  };
  // --- End Copied Handlers ---

  return (
    <>
      {/* Main container */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:p-6">
          {/* Header and Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calls & Meetings</h2>
            <div className="flex space-x-3">
              <button 
                onClick={handleNewGoogleMeeting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700" 
              >
                <Video className="h-4 w-4 mr-2" /> 
                New Google Meeting
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                <Phone className="h-4 w-4 mr-2" />
                New Call
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="search"
                name="call-search"
                id="call-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
                placeholder="Search Calls by Lead or Agent name..." 
              />
            </div>
          </div>


          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Today's Calls</span>
              </div>
              <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{mockCalls.length}</p> 
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Avg Duration</span>
              </div>
              <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">15:30</p> 
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center">
                <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Active Agents</span>
              </div>
              <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">2</p> 
            </div>
          </div>

          {/* Calls History List - RESTORED */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8"> 
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Calls History</h3> {/* Renamed */}
            {filteredCalls.length > 0 ? (
              <div className="space-y-4">
                {filteredCalls.map((call) => (
                  <div 
                    key={call.id} 
                    className={`bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-600 ${call.insights ? 'cursor-pointer hover:shadow-md hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all' : 'opacity-70'}`}
                    onClick={() => handleItemClick(call)} 
                    role={call.insights ? "button" : undefined}
                    tabIndex={call.insights ? 0 : undefined}
                    onKeyDown={(e) => { if (call.insights && (e.key === 'Enter' || e.key === ' ')) handleItemClick(call); }} 
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                        <div>
                          <span className="font-medium text-gray-800 dark:text-gray-100">{call.leadName}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(Agent: {call.agentName})</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {call.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="mt-2 pl-8">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Duration: {call.duration}</p>
                      {!call.insights && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">No insights available</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">No calls match your search.</p>
            )}
          </div>

          {/* Recent Meetings List */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8"> 
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Meetings</h3>
            {mockMeetingsData.length > 0 ? ( 
              <div className="space-y-4">
                {mockMeetingsData.map((meeting) => (
                  <div 
                    key={meeting.id} 
                    className={`bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-600 ${meeting.insights ? 'cursor-pointer hover:shadow-md hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all' : 'opacity-70'}`} 
                    onClick={() => handleItemClick(meeting)} 
                    role={meeting.insights ? "button" : undefined}
                    tabIndex={meeting.insights ? 0 : undefined}
                    onKeyDown={(e) => { if (meeting.insights && (e.key === 'Enter' || e.key === ' ')) handleItemClick(meeting); }} 
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Video className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                        <div>
                          <span className="font-medium text-gray-800 dark:text-gray-100">{meeting.leadName}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(Agent: {meeting.agentName})</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {meeting.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-2 pl-8">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Duration: {meeting.duration}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Platform: {meeting.platform}</p>
                       {!meeting.insights && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">No insights available</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">No recent meetings found.</p>
            )}
          </div>

          {/* Next Meetings Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
              Next Meetings
            </h3>
            <div className="space-y-4">
              {nextMeetings.length > 0 ? (
                nextMeetings.map((meeting) => (
                  <div key={meeting.id} className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-start text-sm mb-2">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{meeting.type} with {meeting.leadName}</p>
                        <p className="text-gray-600 dark:text-gray-300">{formatDateTime(meeting.date)}</p>
                      </div>
                      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        meeting.status === 'Confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {meeting.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      {meeting.type === 'Call' && (
                        <button onClick={() => handleMeetingCall(meeting)} className="text-xs inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-500 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                          <Phone className="h-3 w-3 mr-1" /> Call
                        </button>
                      )}
                      {meeting.type === 'Videoconference' && meeting.url && (
                        <button onClick={() => handleMeetingVideo(meeting)} className="text-xs inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-500 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                          <Video className="h-3 w-3 mr-1" /> Meet
                        </button>
                      )}
                      <button onClick={() => handleAddToCalendar(meeting)} className="text-xs inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-500 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ExternalLink className="h-3 w-3 mr-1" /> Add to Calendar
                      </button>
                      {meeting.status === 'To be confirmed' && (
                        <button onClick={() => handleConfirmMeeting(meeting.id)} className="text-xs inline-flex items-center px-2 py-1 border border-transparent rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800">
                          <Check className="h-3 w-3 mr-1" /> Confirm via WA
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No upcoming meetings scheduled.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Render CallInsightsView */}
      {selectedItem && selectedItem.insights && (
        <CallInsightsView 
          item={selectedItem} 
          onClose={handleCloseInsights} 
          onNavigate={onNavigate} 
        />
      )}
    </>
  );
}
