import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MoreHorizontal, Plus } from 'lucide-react';
import { LeadProfile } from './LeadProfile';
import type { Lead, LeadsTableSort } from '../types';

interface LeadsTableProps {
  leads: Lead[];
  onSort: (sort: LeadsTableSort) => void;
  onBulkAction: (action: string, leadIds: string[]) => void;
  onNavigate: (view: string) => void; 
}

export function LeadsTable({ leads, onSort, onBulkAction, onNavigate }: LeadsTableProps) {
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<LeadsTableSort>({
    field: 'lastContact',
    direction: 'desc'
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleSort = (field: keyof Lead) => {
    const direction = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    const newSort = { field, direction };
    setSortConfig(newSort);
    onSort(newSort);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeads(new Set(leads.map(lead => lead.id)));
    } else {
      setSelectedLeads(new Set());
    }
  };

  const handleSelectLead = (leadId: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const getSortIcon = (field: keyof Lead) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <>
      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Table Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Leads</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">{leads.length} total</span>
          </div>
          <button className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </button>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-900 dark:focus:ring-offset-gray-800"
                      checked={selectedLeads.size === leads.length && leads.length > 0}
                      onChange={handleSelectAll}
                      disabled={leads.length === 0}
                    />
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('score')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Score</span>
                      {getSortIcon('score')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('lastContact')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Last Contact</span>
                      {getSortIcon('lastContact')}
                    </div>
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-900 dark:focus:ring-offset-gray-800"
                        checked={selectedLeads.has(lead.id)}
                        onChange={() => handleSelectLead(lead.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 text-left"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{lead.company}</div>
                        </div>
                      </button>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-2 w-16 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{lead.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Status Badges - Adjust dark mode colors as needed */}
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          lead.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          lead.status === 'qualified' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          lead.status === 'proposal' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }
                      `}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(lead.lastContact).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bulk Actions Footer */}
        {selectedLeads.size > 0 && (
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {selectedLeads.size} selected
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onBulkAction('delete', Array.from(selectedLeads))}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  Delete
                </button>
                <button
                  onClick={() => onBulkAction('export', Array.from(selectedLeads))}
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lead Profile Modal */}
      {selectedLead && (
        <LeadProfile
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onNavigate={onNavigate} 
        />
      )}
    </>
  );
}
