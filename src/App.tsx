import React from 'react';
import TaskBoard from './components/TaskBoard';
import { Search, Coffee, FileText } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#2c3e50] text-[#ecf0f1] py-8">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        <header className="mb-8 detective-tape pt-10">
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <Search className="text-[#f1c40f] mr-3" size={32} strokeWidth={1.5} />
              <h1 className="text-3xl font-bold text-[#ecf0f1]">CASE FILES</h1>
              <Coffee className="ml-4 text-[#e74c3c]" size={24} />
            </div>
            <div className="flex items-center">
              <FileText className="mr-2 text-[#ecf0f1]" size={18} />
              <div className="text-sm text-[#bdc3c7]">Evidence stored locally</div>
            </div>
          </div>
          <p className="text-[#bdc3c7] mt-4 italic">
            Drag clues between boards to organize your investigation
          </p>
        </header>
        
        <div className="flex-1 overflow-hidden">
          <TaskBoard />
        </div>
        
        <footer className="mt-8 text-center text-sm text-[#bdc3c7] py-4 border-t border-[#34495e]">
          <p>Case #2025-0601 • Drag evidence to reclassify • Add new clues as needed</p>
        </footer>
      </div>
    </div>
  );
}

export default App;