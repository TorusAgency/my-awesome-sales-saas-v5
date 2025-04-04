import React, { useState } from 'react';
import { 
  GraduationCap, Bot, FileText, Lightbulb, Target, Brain, Handshake, ChevronDown, 
  ClipboardList, CheckCircle // Import missing icons
} from 'lucide-react';
import type { Lead } from '../types';

interface SalesTrainingViewProps {
  leads: Lead[]; // Accept leads data for dropdown
}

// Define training sections with icons
const trainingSections = [
  { id: 'callPlan', title: 'Call Plan', icon: FileText },
  { id: 'salesScript', title: 'Sales Script', icon: ClipboardList }, 
  { id: 'spinSelling', title: 'SPIN Selling', icon: Lightbulb },
  { id: 'mentalTriggers', title: 'Mental Triggers', icon: Brain },
  { id: 'batna', title: 'BATNA', icon: Target },
  { id: 'bant', title: 'BANT', icon: CheckCircle }, 
  { id: 'negotiationTips', title: 'Negotiation Tips', icon: Handshake },
];

export function SalesTrainingView({ leads }: SalesTrainingViewProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [trainingContent, setTrainingContent] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [openSection, setOpenSection] = useState<string | null>(null); // State to control accordion

  const handleLeadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLeadId(e.target.value);
    // Reset content and open section when lead changes
    setTrainingContent({}); 
    setIsLoading({});
    setOpenSection(null); 
  };

  const toggleSection = (sectionId: string) => {
    if (openSection === sectionId) {
      setOpenSection(null); // Close if already open
    } else {
      setOpenSection(sectionId); // Open the new section
      // Fetch content only if it hasn't been fetched yet for this lead
      if (!trainingContent[sectionId] && !isLoading[sectionId]) {
        fetchTrainingContent(sectionId);
      }
    }
  };

  const fetchTrainingContent = async (sectionId: string) => {
    if (!selectedLeadId) {
      // Optionally show a more user-friendly message
      console.warn("Please select a lead first.");
      return;
    }
    
    setIsLoading(prev => ({ ...prev, [sectionId]: true }));
    setTrainingContent(prev => ({ ...prev, [sectionId]: null })); // Clear previous content for refresh

    console.log(`Fetching AI content for section ${sectionId}, lead ${selectedLeadId}`);
    // TODO: Replace with actual API call
    // Example: const response = await fetch(`/api/sales-training/${sectionId}`, { method: 'POST', body: JSON.stringify({ leadId: selectedLeadId }) });
    // const data = await response.json();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    const selectedLead = leads.find(l => l.id === selectedLeadId);
    const mockContent = `## AI-Generated ${trainingSections.find(s=>s.id === sectionId)?.title} for ${selectedLead?.name || 'Selected Lead'}
    
*(This is placeholder text based on mock data. Integrate with your AI API to get real insights based on CRM, LinkedIn, and web scraping data.)*

**Key Considerations for ${selectedLead?.company || 'this company'}:**
*   Industry: [Fetch from CRM]
*   Recent News: [Fetch from Web Scraping]
*   LinkedIn Insights: [Fetch from LinkedIn API]
*   Potential Pain Points: [Infer from CRM/Web]

**Tailored ${trainingSections.find(s=>s.id === sectionId)?.title} Points:**
1.  Point specific to ${sectionId} and the lead's context.
2.  Another relevant point for ${sectionId}.
3.  Leverage [CRM Field, e.g., 'Source'] to tailor the approach.

*(Content generation simulation complete)*`;
    
    setTrainingContent(prev => ({ ...prev, [sectionId]: mockContent }));
    setIsLoading(prev => ({ ...prev, [sectionId]: false }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <GraduationCap className="h-8 w-8 mr-3 text-indigo-600" />
          AI Sales Training
        </h1>
        {/* Lead Selector */}
        <div className="w-full sm:w-auto">
          <label htmlFor="lead-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Lead</label>
          <select
            id="lead-select"
            value={selectedLeadId}
            onChange={handleLeadChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="" disabled>-- Select a Lead --</option>
            {leads.map(lead => (
              <option key={lead.id} value={lead.id}>
                {lead.name} ({lead.company})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Training Sections (Accordion Style) */}
      <div className="space-y-3">
        {trainingSections.map(section => (
          <div key={section.id} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Section Header (Clickable) */}
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => toggleSection(section.id)}
              role="button"
              aria-expanded={openSection === section.id}
              aria-controls={`section-content-${section.id}`}
              tabIndex={0}
               onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection(section.id); }}
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <section.icon className="h-5 w-5 mr-3 text-indigo-500" />
                {section.title}
              </h2>
              <div className="flex items-center space-x-3">
                 {/* Refresh Button */}
                 <button 
                   title="Generate/Refresh Content"
                   onClick={(e) => { 
                     e.stopPropagation(); // Prevent toggling the section
                     if (selectedLeadId) {
                       fetchTrainingContent(section.id);
                       setOpenSection(section.id); // Ensure section is open after refresh
                     } else {
                       alert("Please select a lead first.");
                     }
                   }} 
                   disabled={isLoading[section.id] || !selectedLeadId}
                   className="text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded hover:bg-indigo-100 dark:hover:bg-gray-600"
                 >
                   {isLoading[section.id] ? (
                     <Bot className="h-4 w-4 animate-spin" /> 
                   ) : (
                     <Bot className="h-4 w-4" /> // Or use a RefreshCw icon
                   )}
                 </button>
                 {/* Accordion Icon */}
                 <ChevronDown 
                   className={`h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${
                     openSection === section.id ? 'rotate-180' : ''
                   }`} 
                 />
              </div>
            </div>
            
            {/* Section Content (Collapsible) */}
            {openSection === section.id && (
              <div id={`section-content-${section.id}`} className="p-6 border-t border-gray-200 dark:border-gray-700">
                {!selectedLeadId ? (
                   <p className="text-sm text-gray-500 dark:text-gray-400 italic">Please select a lead to generate training content.</p>
                ) : isLoading[section.id] ? (
                  <div className="flex justify-center items-center p-4">
                    <Bot className="h-6 w-6 mr-2 animate-spin text-indigo-600" />
                    <span className="text-gray-600 dark:text-gray-400">Generating AI insights...</span>
                  </div>
                ) : trainingContent[section.id] ? (
                  // Basic markdown simulation (replace with a proper markdown renderer if needed)
                  <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {trainingContent[section.id]?.split('\n').map((line, i) => {
                      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-semibold mt-4 mb-2">{line.substring(3)}</h2>;
                      if (line.startsWith('**')) return <p key={i} className="font-semibold my-2">{line.replace(/\*\*/g, '')}</p>;
                       if (line.startsWith('* ')) return <li key={i} className="ml-4 list-disc">{line.substring(2)}</li>;
                       if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) return <li key={i} className="ml-4 list-decimal">{line.substring(3)}</li>;
                      return <p key={i} className="my-1">{line}</p>;
                    })}
                  </div>
                ) : (
                   <p className="text-sm text-gray-500 dark:text-gray-400 italic">Click the refresh button to generate content.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
