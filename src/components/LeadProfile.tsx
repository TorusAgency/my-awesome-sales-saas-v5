import React, { useState, useEffect } from 'react';
import { 
  Phone, MessageSquare, Linkedin, X, Calendar, FileText, Mail, Clock, Target, TrendingUp, CheckCircle, XCircle, History, 
  DollarSign, ChevronDown, Plus, Bot, Loader2, Video, ExternalLink, Check, ClipboardList 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Lead, Call } from '../types'; 
import { CallInsightsView } from './CallInsightsView'; 
import { TimelineItemDetails } from './TimelineItemDetails'; 

interface LeadProfileProps {
  lead: Lead;
  onClose: () => void;
  onNavigate: (view: string) => void; 
}

// --- Mock Data ---
const interactionData = [
  { date: '2024-01', interactions: 5 },
  { date: '2024-02', interactions: 8 },
  { date: '2024-03', interactions: 12 },
];
const timeline = [
   {
    id: 1,
    date: '2024-03-15',
    type: 'email',
    title: 'Initial Contact',
    description: 'Sent introduction email',
    status: 'success'
  },
  {
    id: 2,
    date: '2024-03-12',
    type: 'meeting',
    title: 'Discovery Call',
    description: 'Discussed business needs and pain points',
    status: 'success'
  },
  {
    id: 3,
    date: '2024-03-10',
    type: 'document',
    title: 'Proposal Sent',
    description: 'Sent detailed solution proposal',
    status: 'pending'
  }
];
const mockLeadCalls: Call[] = [
  {
    id: 'lead-call-1',
    leadName: 'John Smith', 
    agentName: 'Alice Brown',
    timestamp: new Date('2024-03-10T10:30:00'),
    duration: '15:20',
    insights: { 
      summary: 'Initial discovery call. Discussed needs for AI automation.',
      keyPoints: ['Pain point: Manual data entry', 'Interest in AI features', 'Budget discussion initiated'],
      actionItems: ['Send product brochure', 'Schedule follow-up demo'],
      todoList: ['Log call details in CRM', 'Prepare demo script'],
      overallScore: 80,
      scriptAdherenceScore: 7,
      dealClosureProbability: 65,
      transcription: [
        { timestamp: '00:05', speaker: 'Agent', text: 'Thanks for your time, John.' },
        { timestamp: '02:15', speaker: 'Lead', text: 'Tell me more about the AI capabilities.' },
      ],
    },
  },
  {
    id: 'lead-call-2',
    leadName: 'John Smith',
    agentName: 'Bob White',
    timestamp: new Date('2024-03-05T14:00:00'),
    duration: '05:10',
  },
];

const leadStatusOptions = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];
const solutionOptions = ['AI Automation Suite', 'Data Analytics Platform', 'Cloud Migration Service'];
const mockMeetings = [
  { id: 'm1', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), type: 'Videoconference', status: 'To be confirmed', url: 'https://meet.google.com/xyz-abc-def' },
  { id: 'm2', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), type: 'Call', status: 'Confirmed' },
];
// --- End Mock Data ---

// Helper function to format date
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to format date and time
const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export function LeadProfile({ lead, onClose, onNavigate }: LeadProfileProps) {
  const [selectedCallInsight, setSelectedCallInsight] = useState<Call | null>(null);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<any | null>(null); 
  const [status, setStatus] = useState(lead.status);
  const [mrr, setMrr] = useState<number | string>(1200); 
  const [nrr, setNrr] = useState<number | string>(500);  
  const [solution, setSolution] = useState(solutionOptions[0]);
  const [observations, setObservations] = useState(lead.notes || ''); 
  const [meetings, setMeetings] = useState(mockMeetings); 
  const [isCallPlanLoading, setIsCallPlanLoading] = useState(false);
  const [isSalesScriptLoading, setIsSalesScriptLoading] = useState(false);

  // --- Handlers ---
  const handleCallClick = (call: Call) => { 
     if (call.insights) {
      setSelectedCallInsight(call);
    } else {
      console.log(`Insights not available for call ${call.id}`);
    }
  };
  const handleCloseInsights = () => { 
    setSelectedCallInsight(null);
  };
  const handleTimelineItemClick = (item: any) => { 
    console.log("Timeline item clicked:", item);
    setSelectedTimelineItem(item); 
  };
  const handleCloseTimelineDetails = () => setSelectedTimelineItem(null);
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => { 
    setStatus(e.target.value as Lead['status']);
    console.log("Status changed:", e.target.value);
  };
  const handleMrrChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    setMrr(e.target.value);
    console.log("MRR changed:", e.target.value);
  };
  const handleNrrChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    setNrr(e.target.value);
    console.log("NRR changed:", e.target.value);
  };
  const handleSolutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => { 
    setSolution(e.target.value);
    console.log("Solution changed:", e.target.value);
  };
  const handleAddSolution = () => { 
    console.log("Add Solution button clicked");
  };
  const handleObservationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { 
    setObservations(e.target.value);
    console.log("Observations changed");
  };
  const handleCreateCallPlan = async () => { 
    setIsCallPlanLoading(true);
    console.log("Creating AI Call Plan for lead:", lead.id);
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    console.log("AI Call Plan creation finished (simulated).");
    setIsCallPlanLoading(false);
  };
  const handleCreateSalesScript = async () => { 
    setIsSalesScriptLoading(true);
    console.log("Creating AI Sales Script for lead:", lead.id, "Solution:", solution);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("AI Sales Script creation finished (simulated).");
    setIsSalesScriptLoading(false);
  };
  const handleMeetingCall = (meeting: any) => { 
    console.log("Initiate call for meeting:", meeting.id);
  };
  const handleMeetingVideo = (meeting: any) => { 
    console.log("Open video conference for meeting:", meeting.id, meeting.url);
    if (meeting.url) {
      window.open(meeting.url, '_blank');
    }
  };
  const handleAddToCalendar = (meeting: any) => { 
    console.log("Add meeting to Google Calendar:", meeting.id);
  };
  const handleConfirmMeeting = async (meetingId: string) => { 
    console.log("Requesting confirmation for meeting:", meetingId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMeetings(prevMeetings => prevMeetings.map(m => 
      m.id === meetingId ? { ...m, status: 'Confirmation Requested' } : m 
    ));
    console.log("Confirmation request sent (simulated).");
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-5 w-5" />;
      case 'meeting': return <Calendar className="h-5 w-5" />;
      case 'document': return <FileText className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 text-center">
          {/* Modal Container */}
          <div className="relative inline-block w-full max-w-6xl my-8 text-left align-middle">
            {/* Modal Content Area */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl">
              {/* Close Button */}
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 z-20"
                aria-label="Close lead profile"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Header */}
              <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 pt-12 md:pt-6"> 
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h2>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-h-[calc(100vh-150px)] overflow-y-auto">
                {/* --- Left Column --- */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Contact Info Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                     <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact Information</h3>
                     <div className="space-y-4">
                       <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{lead.company}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{lead.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{lead.phone}</p>
                      </div>
                    </div>
                    <div className="mt-6 space-y-3">
                      <button onClick={() => window.location.href = `tel:${lead.phone}`} className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"> <Phone className="h-4 w-4 mr-2" /> Call Now </button>
                      <button onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}`, '_blank')} className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"> <MessageSquare className="h-4 w-4 mr-2" /> WhatsApp Message </button>
                      <button onClick={() => window.location.href = `mailto:${lead.email}`} className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"> <Mail className="h-4 w-4 mr-2" /> Send E-mail </button>
                      <button onClick={() => window.open('https://linkedin.com/search', '_blank')} className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"> <Linkedin className="h-4 w-4 mr-2" /> View LinkedIn Profile </button>
                    </div>
                  </div>

                  {/* AI Insights Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                     <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">AI Insights</h3>
                     <div className="space-y-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">Engagement Score</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${lead.score}%` }} />
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{lead.score}% likelihood to convert</p>
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">Key Characteristics</span>
                        </div>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>Decision maker in technology procurement</li>
                          <li>Interested in AI and automation</li>
                          <li>Budget-conscious but values quality</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* AI Action Buttons Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-3">
                     <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-900 dark:text-white">
                       <Bot className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                       AI Actions
                     </h3>
                     <button onClick={handleCreateCallPlan} disabled={isCallPlanLoading} className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"> {isCallPlanLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />} Create AI Call Plan </button>
                     <button onClick={handleCreateSalesScript} disabled={isSalesScriptLoading} className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"> {isSalesScriptLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ClipboardList className="h-4 w-4 mr-2" />} Create AI Sales Script </button>
                  </div>
                </div>

                {/* --- Right Column --- */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Opportunity Summary Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Opportunity Summary</h3>
                    <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-4">
                      {/* Status Dropdown */}
                      <div className="w-full md:w-auto">
                        <label htmlFor="lead-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                        <select id="lead-status" value={status} onChange={handleStatusChange} className="block w-full pl-3 pr-10 py-1.5 text-sm border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                          {leadStatusOptions.map(opt => <option key={opt} value={opt.toLowerCase().replace(' ', '')}>{opt}</option>)}
                        </select>
                      </div>
                      {/* MRR Input */}
                      <div className="relative w-full md:w-auto">
                        <label htmlFor="lead-mrr" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MRR</label>
                        <div className="absolute inset-y-0 left-0 pl-3 pt-7 flex items-center pointer-events-none"> <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-500" /> </div>
                        <input type="number" id="lead-mrr" value={mrr} onChange={handleMrrChange} placeholder="0.00" className="block w-full md:w-28 pl-8 pr-2 py-1.5 text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" aria-label="Monthly Recurring Revenue" />
                      </div>
                      {/* NRR Input */}
                      <div className="relative w-full md:w-auto">
                        <label htmlFor="lead-nrr" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">NRR</label>
                        <div className="absolute inset-y-0 left-0 pl-3 pt-7 flex items-center pointer-events-none"> <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-500" /> </div>
                        <input type="number" id="lead-nrr" value={nrr} onChange={handleNrrChange} placeholder="0.00" className="block w-full md:w-28 pl-8 pr-2 py-1.5 text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" aria-label="Non-Recurring Revenue" />
                      </div>
                      {/* Solution Dropdown */}
                      <div className="flex-grow"> 
                        <label htmlFor="lead-solution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Solution</label>
                        <div className="flex items-center space-x-1 w-full">
                          <select id="lead-solution" value={solution} onChange={handleSolutionChange} className="block w-full pl-3 pr-10 py-1.5 text-sm border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm flex-grow bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            {solutionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                          <button onClick={handleAddSolution} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-shrink-0 mt-6" aria-label="Add New Solution"> <Plus className="h-4 w-4" /> </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interaction History Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                     <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Interaction History</h3>
                     <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={interactionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" /> 
                          <XAxis dataKey="date" stroke="#9CA3AF" /> 
                          <YAxis stroke="#9CA3AF" /> 
                          <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} itemStyle={{ color: '#D1D5DB' }} /> 
                          <Line type="monotone" dataKey="interactions" stroke="#818CF8" strokeWidth={2} /> 
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Call History Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                     <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                      <History className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                      Call History
                    </h3>
                    <div className="space-y-4">
                      {mockLeadCalls.length > 0 ? (
                        mockLeadCalls.map((call) => (
                          <div key={call.id} className={`bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border border-gray-200 dark:border-gray-600 ${call.insights ? 'cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 hover:border-indigo-200 dark:hover:border-indigo-500 transition-colors' : 'opacity-70'}`} onClick={() => handleCallClick(call)} role={call.insights ? "button" : undefined} tabIndex={call.insights ? 0 : undefined} onKeyDown={(e) => { if (call.insights && (e.key === 'Enter' || e.key === ' ')) handleCallClick(call); }}>
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                                <span className="font-medium text-gray-800 dark:text-gray-100">Call with {call.agentName}</span>
                              </div>
                              <span className="text-gray-500 dark:text-gray-400">{formatDate(call.timestamp)}</span>
                            </div>
                            <div className="mt-1 text-xs text-gray-600 dark:text-gray-300 pl-6">
                              Duration: {call.duration}
                              {!call.insights && <span className="ml-2 text-gray-400 dark:text-gray-500">(No insights)</span>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No calls recorded for this lead.</p>
                      )}
                    </div>
                  </div>

                  {/* Next Meetings Section */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                      <Calendar className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                      Next Meetings
                    </h3>
                    <div className="space-y-4">
                      {meetings.length > 0 ? (
                        meetings.map((meeting) => (
                          <div key={meeting.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border border-gray-200 dark:border-gray-600">
                            <div className="flex justify-between items-start text-sm mb-2">
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-100">{meeting.type}</p>
                                <p className="text-gray-600 dark:text-gray-300">{formatDateTime(meeting.date)}</p>
                              </div>
                              <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${ meeting.status === 'Confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }`}> {meeting.status} </span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                              {meeting.type === 'Call' && ( <button onClick={() => handleMeetingCall(meeting)} className="text-xs inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-500 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"> <Phone className="h-3 w-3 mr-1" /> Call </button> )}
                              {meeting.type === 'Videoconference' && meeting.url && ( <button onClick={() => handleMeetingVideo(meeting)} className="text-xs inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-500 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"> <Video className="h-3 w-3 mr-1" /> Meet </button> )}
                              <button onClick={() => handleAddToCalendar(meeting)} className="text-xs inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-500 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"> <ExternalLink className="h-3 w-3 mr-1" /> Add to Calendar </button>
                              {meeting.status === 'To be confirmed' && ( <button onClick={() => handleConfirmMeeting(meeting.id)} className="text-xs inline-flex items-center px-2 py-1 border border-transparent rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800"> <Check className="h-3 w-3 mr-1" /> Confirm via WA </button> )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No upcoming meetings scheduled.</p>
                      )}
                    </div>
                  </div>

                  {/* Timeline Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Timeline</h3>
                    <div className="flow-root">
                      <ul className="-mb-8">
                        {timeline.map((event, eventIdx) => (
                          <li key={event.id}>
                            <div className="relative pb-8">
                              {eventIdx !== timeline.length - 1 ? ( <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-600" aria-hidden="true" /> ) : null}
                              <button onClick={() => handleTimelineItemClick(event)} className="relative flex space-x-3 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded-md transition-colors">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${event.status === 'success' ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-600'}`}>
                                  {React.cloneElement(getTimelineIcon(event.type), { className: `h-5 w-5 ${event.status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}` })}
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                  <div>
                                    <p className="text-sm text-gray-900 dark:text-white">{event.title}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{event.description}</p>
                                  </div>
                                  <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400"> {event.date} </div>
                                </div>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Deal Progress Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                     <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Deal Progress</h3>
                     <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Deal Stage</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">75%</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }} />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Success Indicators</span>
                          </div>
                          <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>Quick response times</li> <li>Multiple stakeholder engagement</li> <li>Budget aligned</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <XCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Risk Factors</span>
                          </div>
                          <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>Long decision-making cycle</li> <li>Competition presence</li> <li>Budget constraints</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Observation Field */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                     <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Observations</h3>
                     <textarea rows={5} value={observations} onChange={handleObservationsChange} placeholder="Add general observations about this lead..." className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render Modals */}
      {selectedCallInsight && selectedCallInsight.insights && ( 
        <CallInsightsView 
          item={selectedCallInsight} // Corrected prop name
          onClose={handleCloseInsights} 
          onNavigate={onNavigate} 
        /> 
      )}
      {selectedTimelineItem && ( <TimelineItemDetails item={selectedTimelineItem} onClose={handleCloseTimelineDetails} /> )}
    </>
  );
}
