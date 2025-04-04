import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { 
  ArrowUpRight, ArrowDownRight, Users, Phone, Target, DollarSign, 
  CheckCircle, XCircle 
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'; 
import type { SalesMetric } from '../types';

interface DashboardMetricsProps {
  onNavigate: (view: string) => void;
  startDate: Date; // Added startDate prop
  endDate: Date;   // Added endDate prop
}

// Initial structure for metrics (base values, icons, links)
const initialMetricsConfig = [
  { id: '1', name: 'Total Leads', baseValue: 2500, icon: 'users', linkTo: 'leads' },
  { id: '2', name: 'Calls Analyzed', baseValue: 1100, icon: 'phone', linkTo: 'calls' },
  { id: '3', name: 'Conversion Rate', baseValue: 28, icon: 'target', linkTo: 'conversion' },
  { id: '4', name: 'Revenue', baseValue: 800000, icon: 'dollar' },
  { id: '5', name: 'Wins', baseValue: 120, icon: 'check', linkTo: 'opportunities' },
  { id: '6', name: 'Losses', baseValue: 35, icon: 'x', linkTo: 'opportunities' },
];

// Function to generate more varied graph data within a date range
const generateGraphDataForRange = (startDate: Date, endDate: Date, baseValue: number) => {
  const data = [];
  let currentValue = baseValue;
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay)) + 1; // +1 to include end date

  // Ensure at least 2 data points for a line, even for single day range
  const daysToGenerate = Math.max(diffDays, 2); 

  for (let i = 0; i < daysToGenerate; i++) {
    const currentDate = new Date(startDate.getTime() + i * oneDay);
    // Introduce more variation: fluctuation up to 30% of base value
    const fluctuation = (Math.random() - 0.5) * (baseValue * 0.6); 
    currentValue = Math.max(0, Math.round(currentValue + fluctuation)); // Ensure value doesn't go below 0

    // Format date as 'MMM DD' (e.g., 'Mar 15')
    const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    data.push({
      name: formattedDate, // Use formatted date for tooltip label
      value: currentValue,
    });
  }
  // If only one day was selected, duplicate the point to draw a line
   if (diffDays === 1 && data.length === 1) {
     data.push({ ...data[0], name: data[0].name + ' ' }); // Add space to make name unique for recharts
   }

  return data;
};


const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'users': return <Users className="w-6 h-6 text-indigo-600" />; 
    case 'phone': return <Phone className="w-6 h-6 text-blue-600" />; 
    case 'target': return <Target className="w-6 h-6 text-green-600" />; 
    case 'dollar': return <DollarSign className="w-6 h-6 text-yellow-600" />; 
    case 'check': return <CheckCircle className="w-6 h-6 text-emerald-600" />; 
    case 'x': return <XCircle className="w-6 h-6 text-rose-600" />; 
    default: return null;
  }
};

// Custom Tooltip for Sparklines - Displays date and value
const SparklineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 text-xs px-2 py-1 rounded shadow-lg">
        {/* Label is the formatted date from graphData */}
        {`${label}: ${payload[0].value.toLocaleString()}`} 
      </div>
    );
  }
  return null;
};

export function DashboardMetrics({ onNavigate, startDate, endDate }: DashboardMetricsProps) {
  // State to hold the metrics data, including dynamic graphData
  const [metricsData, setMetricsData] = useState<SalesMetric[]>([]);

  // Effect to update metrics when date range changes
  useEffect(() => {
    console.log('DashboardMetrics useEffect triggered by date change:', startDate, endDate);
    const updatedMetrics = initialMetricsConfig.map(config => {
      const graphData = generateGraphDataForRange(startDate, endDate, config.baseValue);
      // Use the last value from graphData as the current metric value
      const currentValue = graphData.length > 0 ? graphData[graphData.length - 1].value : config.baseValue;
      // Calculate trend based on first and last points (simple example)
      let trend = 0;
      if (graphData.length >= 2) {
        const firstValue = graphData[0].value;
        const lastValue = graphData[graphData.length - 1].value;
        if (firstValue > 0) {
          trend = ((lastValue - firstValue) / firstValue) * 100;
        } else if (lastValue > 0) {
          trend = 100; // Trend is positive if starting from 0
        }
      }

      return {
        ...config,
        value: currentValue,
        trend: parseFloat(trend.toFixed(1)), // Keep trend calculation simple for now
        graphData: graphData,
      };
    });
    setMetricsData(updatedMetrics);
  }, [startDate, endDate]); // Dependency array includes startDate and endDate

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
      {metricsData.map((metric) => (
        <div
          key={metric.id}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex flex-col justify-between border border-gray-200 dark:border-gray-700 ${ 
            metric.linkTo ? 'cursor-pointer hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700' : ''
          } transition-all duration-200`}
          onClick={() => metric.linkTo && onNavigate(metric.linkTo)}
          role={metric.linkTo ? 'button' : 'presentation'}
          tabIndex={metric.linkTo ? 0 : undefined} 
           onKeyDown={(e) => { if (metric.linkTo && (e.key === 'Enter' || e.key === ' ')) onNavigate(metric.linkTo); }} 
        >
          {/* Top Section: Icon, Name, Trend */}
          <div> 
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"> 
                {getIcon(metric.icon)}
              </div>
              <span className={`flex items-center text-xs font-medium ${ 
                metric.trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' 
              }`}>
                {metric.trend >= 0 ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" /> 
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-0.5" /> 
                )}
                {Math.abs(metric.trend)}%
              </span>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium truncate">{metric.name}</h3>
          </div>

          {/* Middle Section: Value and Sparkline */}
          <div className="mt-2 mb-1"> 
            <p className="text-2xl font-semibold text-gray-900 dark:text-white"> 
              {metric.icon === 'dollar' ? '$' : ''}
              {metric.value.toLocaleString()}
              {metric.icon === 'target' ? '%' : ''}
            </p>
            {/* Sparkline Graph */}
            {metric.graphData && metric.graphData.length > 0 && ( // Check if graphData exists and is not empty
              <div className="h-12 mt-2"> 
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metric.graphData}>
                    <Tooltip 
                      content={<SparklineTooltip />} 
                      cursor={{ stroke: '#a0aec0', strokeWidth: 1, strokeDasharray: '3 3' }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={metric.trend >= 0 ? '#10b981' : '#f43f5e'} 
                      strokeWidth={2} 
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Bottom Section: View Details Link */}
          {metric.linkTo && (
            <div className="mt-auto pt-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline self-start"> 
              View details →
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
