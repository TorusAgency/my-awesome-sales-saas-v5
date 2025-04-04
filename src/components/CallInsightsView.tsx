import React, { useState, useEffect } from 'react';
import { 
  X, FileText, ListChecks, Target, Percent, ClipboardList, MessageSquare, Star, TrendingUp, User, Plus, GripVertical 
} from 'lucide-react';
import type { Call, Meeting, CallInsights } from '../types'; 

interface CallInsightsViewProps {
  item: Call | Meeting; 
  onClose: () => void;
  onNavigate: (view: string) => void; 
}

// Helper to format transcription timestamp
const formatTimestamp = (timestamp: string): string => {
  return timestamp; 
};

// Helper to format date as DD/MM/YYYY
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Define classification options
const classificationOptions = ["-- Select Classification --", "Prospect", "Lead", "Presentation", "Win", "Lost"];

export function CallInsightsView({ item, onClose, onNavigate }: CallInsightsViewProps) { 
  const insights = item.insights as CallInsights; 
  if (!insights) {
    console.error("CallInsightsView rendered without insights!");
    return null; 
  }

  const [todos, setTodos] = useState<string[]>([]);
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [todoCheckedState, setTodoCheckedState] = useState<Record<number, boolean>>({});
  const [actionItemCheckedState, setActionItemCheckedState] = useState<Record<number, boolean>>({});
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [classification, setClassification] = useState<string>(classificationOptions[0]);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (insights) {
      setTodos(insights.todoList || []);
      setActionItems(insights.actionItems || []);
      setTodoCheckedState(
        (insights.todoList || []).reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
      );
      setActionItemCheckedState(
        (insights.actionItems || []).reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
      );
    }
    setClassification(classificationOptions[0]);
    setNotes('');
  }, [item]); 

  const handleTodoToggle = (index: number) => {
    setTodoCheckedState(prevState => ({ ...prevState, [index]: !prevState[index] }));
    console.log(`Todo item ${index} toggled. New state: ${!todoCheckedState[index]}`);
  };

  const handleActionItemToggle = (index: number) => {
    setActionItemCheckedState(prevState => ({ ...prevState, [index]: !prevState[index] }));
    console.log(`Action item ${index} toggled. New state: ${!actionItemCheckedState[index]}`);
  };

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      const newTodos = [...todos, newTodoText.trim()];
      setTodos(newTodos);
      setTodoCheckedState(prevState => ({ ...prevState, [newTodos.length - 1]: false }));
      setNewTodoText('');
      console.log(`Added new todo: ${newTodoText.trim()}`);
    }
  };

  const handleNewTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoText(e.target.value);
  };

  const handleNewTodoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddTodo();
  };

  const handleClassificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassification(e.target.value);
    console.log(`Classification changed to: ${e.target.value}`);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleViewLeadDetails = () => {
    onNavigate('leads'); 
    onClose(); 
  };

  const handleTodoSort = (newOrder: string[]) => {
    setTodos(newOrder);
    console.log('TODO: Implement Todo sorting persistence', newOrder);
  };

  const handleActionItemSort = (newOrder: string[]) => {
    setActionItems(newOrder);
    console.log('TODO: Implement Action Item sorting persistence', newOrder);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-50 overflow-y-auto flex justify-center items-start pt-10">
      {/* Modal Container */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8">
        {/* Header */}
        <div className="flex justify-between items-start p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              { 'duration' in item ? 'Call Insights' : 'Meeting Insights' } 
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span>{item.leadName} with {item.agentName} on {formatDate(item.timestamp)}</span>
              <button 
                onClick={handleViewLeadDetails} 
                className="ml-3 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-xs font-medium"
              >
                <User className="h-3 w-3 mr-1" />
                View Lead Details
              </button>
            </div>
            {/* Call Classification Dropdown */}
            <div className="mt-3">
              <label htmlFor="item-classification" className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                Classification:
              </label>
              <select
                id="item-classification"
                name="item-classification"
                value={classification}
                onChange={handleClassificationChange}
                className="mt-1 block w-full max-w-xs pl-3 pr-10 py-1 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {classificationOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 absolute top-3 right-3"
            aria-label="Close insights"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Scores & Probability */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-indigo-50 dark:bg-indigo-900/50 p-4 rounded-lg text-center">
              <Star className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
              <p className="text-sm text-indigo-800 dark:text-indigo-300 font-medium">Overall Score</p>
              <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{insights.overallScore}/100</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg text-center">
              <ClipboardList className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="text-sm text-green-800 dark:text-green-300 font-medium">Script Adherence</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{insights.scriptAdherenceScore}/10</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/50 p-4 rounded-lg text-center">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-purple-800 dark:text-purple-300 font-medium">Closure Probability</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{insights.dealClosureProbability}%</p>
            </div>
          </div>

          {/* Summary & Key Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                <MessageSquare className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                Summary
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{insights.summary}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                <Target className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                Key Discussion Points
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {insights.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Items & To-Do List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identified Action Items */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                <Percent className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                Identified Action Items
              </h3>
              <ol className="space-y-2">
                {actionItems.map((itemText, index) => ( 
                  <li key={index} className="flex items-center group">
                    <GripVertical className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
                    <input
                      id={`action-${index}`}
                      type="checkbox"
                      checked={actionItemCheckedState[index] || false}
                      onChange={() => handleActionItemToggle(index)}
                      className="h-4 w-4 text-indigo-600 dark:text-indigo-500 border-gray-300 dark:border-gray-500 rounded focus:ring-indigo-500 mr-3 bg-gray-100 dark:bg-gray-600 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800"
                    />
                    <label 
                      htmlFor={`action-${index}`} 
                      className={`text-sm text-gray-700 dark:text-gray-300 ${actionItemCheckedState[index] ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}
                    >
                      {itemText}
                    </label>
                  </li>
                ))}
                 {actionItems.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 italic">No action items identified.</p>}
              </ol>
            </div>
            {/* Consolidated To-Do List */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                <ListChecks className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                Consolidated To-Do List
              </h3>
              <ol className="space-y-2 mb-4">
                {todos.map((todo, index) => (
                  <li key={index} className="flex items-center group">
                    <GripVertical className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
                    <input
                      id={`todo-${index}`}
                      type="checkbox"
                      checked={todoCheckedState[index] || false}
                      onChange={() => handleTodoToggle(index)}
                      className="h-4 w-4 text-indigo-600 dark:text-indigo-500 border-gray-300 dark:border-gray-500 rounded focus:ring-indigo-500 mr-3 bg-gray-100 dark:bg-gray-600 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800"
                    />
                    <label 
                      htmlFor={`todo-${index}`} 
                      className={`text-sm text-gray-700 dark:text-gray-300 ${todoCheckedState[index] ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}
                    >
                      {todo}
                    </label>
                  </li>
                ))}
                {todos.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 italic">No tasks yet.</p>}
              </ol>
              {/* Add New Task Input */}
              <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <input
                  type="text"
                  value={newTodoText}
                  onChange={handleNewTodoChange}
                  onKeyDown={handleNewTodoKeyDown}
                  placeholder="Add a new task..."
                  className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button 
                  onClick={handleAddTodo}
                  className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  disabled={!newTodoText.trim()}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Notes Input Field */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Notes</h3>
            <textarea
              rows={4}
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add your notes here..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Transcription */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
              <FileText className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
              Timestamped Transcription
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {insights.transcription.map((entry, index) => (
                <div key={index} className="flex items-start text-sm">
                  <span className="w-16 text-gray-500 dark:text-gray-400 font-mono text-xs pt-px">
                    [{formatTimestamp(entry.timestamp)}]
                  </span>
                  <span className="font-medium w-20 mr-2 text-gray-800 dark:text-gray-200">{entry.speaker}:</span>
                  <p className="flex-1 text-gray-700 dark:text-gray-300">{entry.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
