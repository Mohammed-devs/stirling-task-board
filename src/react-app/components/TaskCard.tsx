import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/shared/types';
import { GripVertical, AlertCircle, ArrowUp, ArrowDown, Minus, MapPin, Tag, ExternalLink } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const priorityConfig = {
  low: { color: 'text-green-600', bg: 'bg-green-50', icon: ArrowDown },
  medium: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Minus },
  high: { color: 'text-orange-600', bg: 'bg-orange-50', icon: ArrowUp },
  urgent: { color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle },
};

const taskTypeColors: Record<string, { bg: string; text: string }> = {
  'Design': { bg: 'bg-purple-50', text: 'text-purple-700' },
  'Social Media': { bg: 'bg-blue-50', text: 'text-blue-700' },
  'Video/Photo': { bg: 'bg-pink-50', text: 'text-pink-700' },
  'Update/Technical': { bg: 'bg-cyan-50', text: 'text-cyan-700' },
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityConfig[task.priority];
  const PriorityIcon = priority.icon;
  
  const taskTypeColor = task.task_type ? taskTypeColors[task.task_type] || { bg: 'bg-slate-50', text: 'text-slate-700' } : { bg: 'bg-slate-50', text: 'text-slate-700' };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group bg-white border border-slate-200 rounded-lg p-4 cursor-pointer
        hover:shadow-md hover:border-slate-300 transition-all duration-200
        ${isDragging ? 'shadow-lg ring-2 ring-blue-200 opacity-90' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 mt-1 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-800 text-sm leading-snug mb-2 line-clamp-2">
            {task.title}
          </h4>
          
          {task.description && (
            <p className="text-xs text-slate-600 line-clamp-2 mb-3">
              {task.description}
            </p>
          )}

          {/* Task Type and City Labels */}
          <div className="flex flex-wrap gap-2 mb-3">
            {task.task_type && (
              <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${taskTypeColor.bg} ${taskTypeColor.text}`}>
                <Tag className="w-3 h-3" />
                <span>{task.task_type}</span>
              </div>
            )}
            {task.city && (
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                <MapPin className="w-3 h-3" />
                <span>{task.city}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${priority.bg} ${priority.color}`}>
              <PriorityIcon className="w-3 h-3" />
              <span className="capitalize">{task.priority}</span>
            </div>
            
            <div className="text-xs text-slate-400">
              #{task.id}
            </div>
          </div>

          {/* Project Links */}
          {(task.project_link || task.project_link_2) && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex flex-wrap gap-2">
                {task.project_link && (
                  <a
                    href={task.project_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Project 1
                  </a>
                )}
                {task.project_link_2 && (
                  <a
                    href={task.project_link_2}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Project 2
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Requester Info */}
          {task.requester_name && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                <span className="font-medium">Requested by:</span> {task.requester_name}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
