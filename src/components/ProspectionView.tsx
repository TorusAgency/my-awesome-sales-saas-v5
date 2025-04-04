import React, { useState } from 'react'; // Added useState
import { Download, Users, Phone, Mail, BarChart2, DollarSign, Percent, TrendingUp, LineChart as LineChartIcon } from 'lucide-react'; // Added LineChartIcon
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'; // Import recharts components
import type { Lead } from '../types'; 

// Define the expected lead statuses for breakdown
const leadStatuses: Lead['status'][] = ['new', 'contacted', 'qualified', 'proposal sent', 'negotiation', 'closed won', 'closed lost'];

// Helper to format status names
const formatStatusName = (status: string): string => {
  return status
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Mock data for demonstration - Replace with actual data fetching and calculations
const mockProspectionData = {
  inboundLeadsByStatus: { new: 15, contacted: 25, qualified: 10, 'proposal sent': 5, negotiation: 2, 'closed won': 1, 'closed lost': 3, },
  outboundLeadsByStatus: { new: 30, contacted: 40, qualified: 15, 'proposal sent': 8, negotiation: 4, 'closed won': 2, 'closed lost': 10, },
  prospectionCalls: 255,
  prospectionEmails: 870,
  paidTraffic: { impressions: 150000, engagement: 7500, spent: 2500.50, contactToLeadConversionRate: 12.5, },
  // Mock time-series data (e.g., leads acquired per month)
  leadsOverTime: [
    { month: 'Jan', inbound: 5, outbound: 10 },
    { month: 'Feb', inbound: 8, outbound: 15 },
    { month: 'Mar', inbound: 12, outbound: 20 },
    { month: 'Apr', inbound: 10, outbound: 18 },
    { month: 'May', inbound: 15, outbound: 25 },
    { month: 'Jun', inbound: 18, outbound: 28 },
  ]
};

type GraphFilter = 'total' | 'inbound' | 'outbound';

export function ProspectionView() {
  const [graphFilter, setGraphFilter] = useState<GraphFilter>('total');

  // Calculate totals for summary cards
  const totalInbound = Object.values(mockProspectionData.inboundLeadsByStatus).reduce((a, b) => a + b, 0);
  const totalOutbound = Object.values(mockProspectionData.outboundLeadsByStatus).reduce((a, b) => a + b, 0);

  // Prepare data for the graph based on the filter
  const graphData = mockProspectionData.leadsOverTime.map(item => {
    const dataPoint: { month: string; total?: number; inbound?: number; outbound?: number } = { month: item.month };
    if (graphFilter === 'total' || graphFilter === 'inbound') {
      dataPoint.inbound = item.inbound;
    }
    if (graphFilter === 'total' || graphFilter === 'outbound') {
      dataPoint.outbound = item.outbound;
    }
     if (graphFilter === 'total') {
      dataPoint.total = item.inbound + item.outbound;
    }
    return dataPoint;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prospection Summary</h1>
        {/* Optional: Add date range filter or other controls here */}
      </div>

      {/* Lead Source Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inbound Leads Card */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <Download className="h-5 w-5 mr-2 text-blue-500" />
            Inbound Leads ({totalInbound})
          </h2>
          <ul className="space-y-2">
            {leadStatuses.map(status => (
              <li key={`inbound-${status}`} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-300">{formatStatusName(status)}</span>
                <span className="font-medium text-gray-900 dark:text-white">{mockProspectionData.inboundLeadsByStatus[status] || 0}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Outbound Leads Card */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Outbound Leads ({totalOutbound})
          </h2>
          <ul className="space-y-2">
            {leadStatuses.map(status => (
              <li key={`outbound-${status}`} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-300">{formatStatusName(status)}</span>
                <span className="font-medium text-gray-900 dark:text-white">{mockProspectionData.outboundLeadsByStatus[status] || 0}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

       {/* Leads Over Time Graph */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
           <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
             <LineChartIcon className="h-5 w-5 mr-2 text-purple-500" />
             Leads Acquired Over Time
           </h2>
           {/* Filter Buttons */}
           <div className="flex space-x-2">
             {(['total', 'inbound', 'outbound'] as GraphFilter[]).map(filter => (
               <button
                 key={filter}
                 onClick={() => setGraphFilter(filter)}
                 className={`px-3 py-1 text-xs font-medium rounded-full ${
                   graphFilter === filter 
                     ? 'bg-indigo-600 text-white' 
                     : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                 }`}
               >
                 {filter.charAt(0).toUpperCase() + filter.slice(1)}
               </button>
             ))}
           </div>
        </div>
        <div className="h-72 w-full"> {/* Set a height for the chart container */}
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={graphData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
               <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" /> {/* Darker grid */}
               <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
               <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
               <Tooltip 
                 contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }} 
                 itemStyle={{ color: '#D1D5DB', fontSize: 12 }} 
                 labelStyle={{ color: '#F9FAFB', fontSize: 12, fontWeight: 'bold' }}
               />
               <Legend wrapperStyle={{ fontSize: '12px' }} />
               {graphFilter === 'total' && <Line type="monotone" dataKey="total" name="Total" stroke="#8b5cf6" strokeWidth={2} dot={false} />}
               {(graphFilter === 'total' || graphFilter === 'inbound') && <Line type="monotone" dataKey="inbound" name="Inbound" stroke="#3b82f6" strokeWidth={2} dot={false} />}
               {(graphFilter === 'total' || graphFilter === 'outbound') && <Line type="monotone" dataKey="outbound" name="Outbound" stroke="#10b981" strokeWidth={2} dot={false} />}
             </LineChart>
           </ResponsiveContainer>
        </div>
      </div>


      {/* Activity Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex items-center space-x-4">
          <Phone className="h-8 w-8 text-indigo-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Prospection Calls</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockProspectionData.prospectionCalls}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex items-center space-x-4">
          <Mail className="h-8 w-8 text-teal-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Prospection E-mails</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockProspectionData.prospectionEmails}</p>
          </div>
        </div>
      </div>

      {/* Paid Traffic Metrics */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-orange-500" />
          Paid Traffic Performance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Impressions</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{mockProspectionData.paidTraffic.impressions.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Engagement</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{mockProspectionData.paidTraffic.engagement.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ad Spend</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${mockProspectionData.paidTraffic.spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{mockProspectionData.paidTraffic.contactToLeadConversionRate}%</p>
          </div>
        </div>
      </div>

    </div>
  );
}
