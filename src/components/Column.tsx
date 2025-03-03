import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard';
import { Plus, FileSearch, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface ColumnProps {
  column: ColumnType;
  onAddTask: (columnId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ column, onAddTask, onDeleteTask }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const getColumnIcon = (id: string) => {
    switch (id) {
      case 'todo':
        return <AlertTriangle size={18} className="text-[#e74c3c]" />;
      case 'inProgress':
        return <FileSearch size={18} className="text-[#f39c12]" />;
      case 'willDo':
        return <Clock size={18} className="text-[#9b59b6]" />;
      case 'done':
        return <CheckCircle size={18} className="text-[#27ae60]" />;
      default:
        return null;
    }
  };

  return (
    <div className="column-board rounded-lg p-4 border-2 border-[#34495e] shadow-lg flex flex-col h-full relative">
      <div className="pushpin pushpin-top-left"></div>
      <div className="pushpin pushpin-top-right"></div>
      
      <div className="flex items-center justify-between mb-4 bg-[#34495e] p-2 rounded shadow-inner">
        <div className="flex items-center">
          {getColumnIcon(column.id)}
          <h3 className="font-medium text-[#ecf0f1] ml-2 uppercase tracking-wider">{column.title}</h3>
        </div>
        <span className="bg-[#2c3e50] text-xs font-medium rounded-full px-2 py-1 text-[#ecf0f1]">
          {column.tasks.length}
        </span>
      </div>
      
      <div ref={setNodeRef} className="flex-1 overflow-y-auto">
        <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
      </div>
      
      <button
        onClick={() => onAddTask(column.id)}
        className="mt-2 flex items-center justify-center w-full py-2 rounded-md bg-[#34495e] text-[#ecf0f1] hover:bg-[#2c3e50] transition-colors duration-200 border border-[#7f8c8d]"
      >
        <Plus size={16} className="mr-1" />
        <span className="text-sm">Add Clue</span>
      </button>
    </div>
  );
};

export default Column;