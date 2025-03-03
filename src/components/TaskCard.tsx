import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import { Trash2, Paperclip } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  // Generate a random rotation between -3 and 3 degrees based on the task id
  const rotation = React.useMemo(() => {
    // Use the first character of the id to generate a consistent rotation
    const charCode = task.id.charCodeAt(0);
    return (charCode % 7) - 3;
  }, [task.id]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    '--rotation': `${rotation}deg`,
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card bg-[#f5f5f0] p-4 rounded-sm shadow-md border border-[#7f8c8d] mb-3 cursor-grab hover:shadow-lg transition-shadow duration-200 group relative"
    >
      <div className="absolute -top-2 -left-2">
        <Paperclip size={16} className="text-[#7f8c8d] transform -rotate-45" />
      </div>
      
      <div className="flex justify-between items-start">
        <p className="text-[#2c3e50] break-words font-medium">{task.content}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="text-[#7f8c8d] hover:text-[#c0392b] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="text-xs text-[#7f8c8d] mt-2 italic border-t border-dashed border-[#bdc3c7] pt-1">
        {new Date(task.createdAt).toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  );
};

export default TaskCard;