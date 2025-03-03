import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import Column from './Column';
import TaskCard from './TaskCard';
import { Column as ColumnType, ColumnType as ColumnTypeEnum, Task } from '../types';
import { FileText, X } from 'lucide-react';

const initialColumns: ColumnType[] = [
  {
    id: 'todo',
    title: 'Leads to Follow',
    tasks: [],
  },
  {
    id: 'inProgress',
    title: 'Under Investigation',
    tasks: [],
  },
  {
    id: 'willDo',
    title: 'Pending Review',
    tasks: [],
  },
  {
    id: 'done',
    title: 'Case Closed',
    tasks: [],
  },
];

const TaskBoard: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>(() => {
    const savedColumns = localStorage.getItem('taskColumns');
    if (savedColumns) {
      try {
        const parsed = JSON.parse(savedColumns);
        // Convert string dates back to Date objects
        return parsed.map((col: ColumnType) => ({
          ...col,
          tasks: col.tasks.map((task: Task) => ({
            ...task,
            createdAt: new Date(task.createdAt),
          })),
        }));
      } catch (e) {
        console.error('Failed to parse saved columns', e);
        return initialColumns;
      }
    }
    return initialColumns;
  });
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('taskColumns', JSON.stringify(columns));
  }, [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    
    const task = columns
      .flatMap((col) => col.tasks)
      .find((t) => t.id === taskId);
    
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the columns
    const activeColumn = columns.find((col) => 
      col.tasks.some((task) => task.id === activeId)
    );
    
    const overColumn = columns.find((col) => 
      col.id === overId || col.tasks.some((task) => task.id === overId)
    );
    
    if (!activeColumn || !overColumn || activeColumn === overColumn) return;
    
    setColumns((prev) => {
      // Find the task
      const activeTask = activeColumn.tasks.find((task) => task.id === activeId);
      if (!activeTask) return prev;
      
      // Create new arrays
      const newColumns = prev.map((col) => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            tasks: col.tasks.filter((task) => task.id !== activeId),
          };
        } else if (col.id === overColumn.id) {
          return {
            ...col,
            tasks: [...col.tasks, activeTask],
          };
        }
        return col;
      });
      
      return newColumns;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the columns
    const activeColumn = columns.find((col) => 
      col.tasks.some((task) => task.id === activeId)
    );
    
    const overColumn = columns.find((col) => 
      col.tasks.some((task) => task.id === overId) || col.id === overId
    );
    
    if (!activeColumn || !overColumn) {
      setActiveTask(null);
      return;
    }
    
    // If dropping in the same column but different position
    if (activeColumn.id === overColumn.id) {
      const activeTaskIndex = activeColumn.tasks.findIndex((task) => task.id === activeId);
      const overTaskIndex = overColumn.tasks.findIndex((task) => task.id === overId);
      
      if (activeTaskIndex !== overTaskIndex) {
        setColumns((prev) => {
          return prev.map((col) => {
            if (col.id === activeColumn.id) {
              const newTasks = arrayMove(col.tasks, activeTaskIndex, overTaskIndex);
              return { ...col, tasks: newTasks };
            }
            return col;
          });
        });
      }
    }
    
    setActiveTask(null);
  };

  const handleAddTask = (columnId: ColumnTypeEnum) => {
    setAddingToColumn(columnId);
    setNewTaskContent('');
  };

  const handleCreateTask = () => {
    if (!addingToColumn || !newTaskContent.trim()) return;
    
    const newTask: Task = {
      id: uuidv4(),
      content: newTaskContent.trim(),
      createdAt: new Date(),
    };
    
    setColumns((prev) => {
      return prev.map((col) => {
        if (col.id === addingToColumn) {
          return {
            ...col,
            tasks: [...col.tasks, newTask],
          };
        }
        return col;
      });
    });
    
    setAddingToColumn(null);
    setNewTaskContent('');
  };

  const handleDeleteTask = (taskId: string) => {
    setColumns((prev) => {
      return prev.map((col) => {
        return {
          ...col,
          tasks: col.tasks.filter((task) => task.id !== taskId),
        };
      });
    });
  };

  return (
    <div className="h-full flex flex-col">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} onDelete={() => {}} />}
        </DragOverlay>
      </DndContext>
      
      {addingToColumn && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#f5f5f0] rounded-sm p-6 w-full max-w-md border-2 border-[#34495e] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileText className="text-[#2c3e50] mr-2" size={20} />
                <h3 className="text-lg font-medium text-[#2c3e50]">New Evidence</h3>
              </div>
              <button 
                onClick={() => setAddingToColumn(null)}
                className="text-[#7f8c8d] hover:text-[#c0392b]"
              >
                <X size={20} />
              </button>
            </div>
            
            <textarea
              className="w-full border-2 border-[#7f8c8d] rounded-sm p-3 mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-[#3498db] bg-[#ecf0f1] text-[#2c3e50]"
              placeholder="Document your findings..."
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              autoFocus
            />
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setAddingToColumn(null)}
                className="px-4 py-2 text-[#2c3e50] hover:bg-[#bdc3c7] rounded-sm transition-colors border border-[#7f8c8d]"
              >
                Discard
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-[#2c3e50] text-[#ecf0f1] rounded-sm hover:bg-[#34495e] transition-colors"
                disabled={!newTaskContent.trim()}
              >
                File Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;