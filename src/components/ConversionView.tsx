import React from 'react';
import { CheckCircle, XCircle, TrendingUp, BarChart, User, AlertTriangle, Star, Zap, Clock } from 'lucide-react'; // Added more icons
import type { Lead } from '../types';

interface ConversionViewProps {
  leads: Lead[]; // Accept leads data
}

export function ConversionView({ leads }: ConversionViewProps) {
  // Correctly filter leads based on specific 'closed won' and 'closed lost' statuses
  const wonLeads = leads.filter(lead => lead.status === 'closed won');
  const lostLeads = leads.filter(lead => lead.status === 'closed lost');
  
  // Calculate conversion rate based on ALL leads (or define a different base if needed)
  const totalLeadsConsidered = leads.length; 
  const conversionRate = totalLeadsConsidered > 0 ? (wonLeads.length / totalLeadsConsidered) * 100 : 0;

  // --- Mock Insights Data (Replace with actual calculated data) ---
  const commonLossReasons = [
    { reason: "Budget constraints", percentage: 45 },
    { reason: "Competitor chosen", percentage: 30 },
    { reason: "Timing not right", percentage: 15 },
    { reason: "Lost contact", percentage: 10 },
  ];
  const highConvertingCharacteristics = [
    "Responded within 24 hours",
    "Engagement score > 80",
    "Attended product demo",
    "Source: Referral or Website",
  ];
  const leadSourceEffectiveness = [
    { source: "Referral", conversionRate: 45.2 },
    { source: "Website", conversionRate: 30.5 },
    { source: "LinkedIn", conversionRate: 15.8 },
    { source: "Cold Call", conversionRate: 5.1 },
  ];
  const avgTimeToConversion = 45; // Example: days
  // --- End Mock Insights Data ---


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Conversion Analysis</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Leads Won</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{wonLeads.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
          <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Leads Lost</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{lostLeads.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
          <TrendingUp className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Conversion Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{conversionRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Key Conversion Insights - Populated */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <BarChart className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
          Key Conversion Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* Lost Deal Reasons */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded border border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold mb-2 flex items-center text-gray-700 dark:text-gray-200">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" /> Common Reasons for Lost Deals
            </h3>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              {commonLossReasons.map(item => (
                <li key={item.reason} className="flex justify-between">
                  <span>{item.reason}</span>
                  <span className="font-medium">{item.percentage}%</span>
                </li>
              ))}
            </ul>
          </div>

          {/* High-Converting Lead Characteristics */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded border border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold mb-2 flex items-center text-gray-700 dark:text-gray-200">
              <Star className="h-4 w-4 mr-2 text-yellow-500" /> Characteristics of High-Converting Leads
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
              {highConvertingCharacteristics.map((char, index) => (
                <li key={index}>{char}</li>
              ))}
            </ul>
          </div>

          {/* Lead Source Effectiveness */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded border border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold mb-2 flex items-center text-gray-700 dark:text-gray-200">
              <Zap className="h-4 w-4 mr-2 text-green-500" /> Lead Source Effectiveness (Conversion Rate)
            </h3>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
               {leadSourceEffectiveness.sort((a, b) => b.conversionRate - a.conversionRate).map(item => (
                <li key={item.source} className="flex justify-between">
                  <span>{item.source}</span>
                  <span className="font-medium">{item.conversionRate.toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Time-to-Conversion */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded border border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center">
             <Clock className="h-6 w-6 mb-2 text-indigo-500" />
            <h3 className="font-semibold mb-1 text-center text-gray-700 dark:text-gray-200">
              Average Time-to-Conversion
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgTimeToConversion} days</p>
          </div>
        </div>
         <p className="text-xs text-center mt-4 text-gray-500 dark:text-gray-400 italic">
           Note: Insights based on mock data for the selected period. Actual analysis requires backend processing.
         </p>
      </div>

       {/* Won/Lost Lead Lists */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
           <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Won Leads ({wonLeads.length})</h2>
           {wonLeads.length > 0 ? (
             <ul className="space-y-3 max-h-60 overflow-y-auto"> {/* Added max height and scroll */}
               {wonLeads.map(lead => (
                 <li key={lead.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                   <div className="flex items-center">
                     <User className="h-4 w-4 mr-2 text-green-500"/>
                     <span className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</span>
                     <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({lead.company})</span>
                   </div>
                   {/* TODO: Add link to lead profile */}
                 </li>
               ))}
             </ul>
           ) : (
             <p className="text-sm text-gray-500 dark:text-gray-400 italic">No leads marked as 'Won' in this period.</p>
           )}
         </div>
         <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
           <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Lost Leads ({lostLeads.length})</h2>
            {lostLeads.length > 0 ? (
             <ul className="space-y-3 max-h-60 overflow-y-auto"> {/* Added max height and scroll */}
               {lostLeads.map(lead => (
                 <li key={lead.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                   <div className="flex items-center">
                     <User className="h-4 w-4 mr-2 text-red-500"/>
                     <span className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</span>
                     <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({lead.company})</span>
                   </div>
                   {/* TODO: Add link to lead profile */}
                 </li>
               ))}
             </ul>
           ) : (
             <p className="text-sm text-gray-500 dark:text-gray-400 italic">No leads marked as 'Lost' in this period.</p>
           )}
         </div>
       </div>
    </div>
  );
}
