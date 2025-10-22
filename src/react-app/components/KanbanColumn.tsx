import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ColumnWithTasks, Task } from '@/shared/types';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  column: ColumnWithTasks;
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
}

export default function KanbanColumn({ column, onCreateTask, onEditTask }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id.toString(),
  });

  const taskIds = column.tasks.map(task => task.id.toString());

  return (
    <div className="flex flex-col min-w-80 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-700 text-center flex-1">{column.name}</h3>
          <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
            {column.tasks.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 p-4 min-h-[500px] space-y-3"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onEditTask(task)}
            />
          ))}
        </SortableContext>

        <button
          onClick={onCreateTask}
          className="w-full p-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Add a task</span>
        </button>
      </div>
    </div>
  );
}
