import { useState, useEffect } from 'react';
import { Task, CreateTask, UpdateTask, UserProfile, TASK_TYPES, BoardWithColumns } from '@/shared/types';
import { X, Trash2, Copy } from 'lucide-react';

interface TaskModalProps {
  task?: Task | null;
  profile: UserProfile | null;
  board?: BoardWithColumns;
  selectedColumnId?: number | null;
  onSave: (taskData: CreateTask | UpdateTask) => void;
  onDelete?: () => void;
  onClose: () => void;
  onUpdateProfile: () => void;
  onUpdateBoard?: (board: BoardWithColumns) => void;
}



export default function TaskModal({ task, profile, board, selectedColumnId, onSave, onDelete, onClose, onUpdateProfile, onUpdateBoard }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [taskType, setTaskType] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [projectLink2, setProjectLink2] = useState('');
  const [showCopySection, setShowCopySection] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setTaskType(task.task_type || '');
      setProjectLink(task.project_link || '');
      setProjectLink2(task.project_link_2 || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setTaskType('');
      setProjectLink('');
      setProjectLink2('');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !taskType) return;

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      task_type: taskType,
      city: profile?.city || undefined,
      requester_name: profile?.name || undefined,
      requester_email: profile?.email || undefined,
      project_link: projectLink.trim() || undefined,
      project_link_2: projectLink2.trim() || undefined,
    };

    onSave(taskData);
  };

  const getPreviousColumnsTasks = () => {
    if (!board || !selectedColumnId) return [];
    
    const currentColumnIndex = board.columns.findIndex(col => col.id === selectedColumnId);
    if (currentColumnIndex <= 0) return [];
    
    const currentColumn = board.columns[currentColumnIndex];
    
    // Special case for Done column - can copy from Review and In Progress
    if (currentColumn.name.toLowerCase() === 'done') {
      const reviewColumn = board.columns.find(col => col.name.toLowerCase() === 'review');
      const inProgressColumn = board.columns.find(col => col.name.toLowerCase() === 'in progress');
      
      const availableTasks = [];
      if (reviewColumn) availableTasks.push(...reviewColumn.tasks);
      if (inProgressColumn) availableTasks.push(...inProgressColumn.tasks);
      
      return availableTasks;
    }
    
    // For all other columns, only copy from immediately previous column
    const previousColumn = board.columns[currentColumnIndex - 1];
    return previousColumn ? previousColumn.tasks : [];
  };

  const handleMoveFromTask = async (sourceTask: Task) => {
    if (!selectedColumnId || !board) return;

    try {
      // Move the task to the new column
      const response = await fetch(`/api/tasks/${sourceTask.id}/move`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          column_id: selectedColumnId,
          position: 0, // Move to top of new column
        }),
      });

      if (!response.ok) throw new Error('Failed to move task');

      const updatedTask = await response.json();

      // Update the board state by moving the task between columns
      const updatedBoard = { ...board };
      
      // Remove task from source column
      const sourceColumnIndex = updatedBoard.columns.findIndex(col => col.id === sourceTask.column_id);
      if (sourceColumnIndex !== -1) {
        updatedBoard.columns[sourceColumnIndex].tasks = updatedBoard.columns[sourceColumnIndex].tasks.filter(
          task => task.id !== sourceTask.id
        );
        
        // Update positions in source column
        updatedBoard.columns[sourceColumnIndex].tasks.forEach((task, index) => {
          task.position = index;
        });
      }

      // Add task to target column at the top
      const targetColumnIndex = updatedBoard.columns.findIndex(col => col.id === selectedColumnId);
      if (targetColumnIndex !== -1) {
        updatedBoard.columns[targetColumnIndex].tasks.unshift(updatedTask);
        
        // Update positions in target column
        updatedBoard.columns[targetColumnIndex].tasks.forEach((task, index) => {
          task.position = index;
        });
      }

      // Update the board in parent component
      if (onUpdateBoard) {
        onUpdateBoard(updatedBoard);
      }
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  };

  const isDoneColumn = Boolean(board && selectedColumnId && 
    board.columns.find(col => col.id === selectedColumnId)?.name.toLowerCase() === 'done');

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
            <h2 className="text-lg font-semibold text-slate-800">
              {task ? 'Edit Task' : 'Add New Task'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {!task && getPreviousColumnsTasks().length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-blue-700">Move from previous columns</p>
                  <button
                    type="button"
                    onClick={() => setShowCopySection(!showCopySection)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    {showCopySection ? 'Hide' : 'Show'} tasks
                  </button>
                </div>
                
                {showCopySection && (
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {getPreviousColumnsTasks().map((task, index) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => handleMoveFromTask(task)}
                        className="w-full text-left p-2 text-sm bg-white rounded border hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded mt-0.5">
                            #{index + 1}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium text-slate-800">{task.title}</div>
                            <div className="text-xs text-slate-500">{task.task_type} • {task.city}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                  Enter task title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter task title"
                  required
                  autoFocus
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="taskType" className="block text-sm font-medium text-slate-700 mb-2">
                  Task Type
                </label>
                <select
                  id="taskType"
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                  required
                >
                  <option value="">Task Type</option>
                  {TASK_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Enter task description...
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Enter task description..."
              />
            </div>

            {(isDoneColumn || (task && task.project_link)) && (
              <>
                <div>
                  <label htmlFor="projectLink" className="block text-sm font-medium text-slate-700 mb-2">
                    Project Link 1 {isDoneColumn && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="url"
                    id="projectLink"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="https://project-link.com"
                    required={isDoneColumn || undefined}
                  />
                </div>

                <div>
                  <label htmlFor="projectLink2" className="block text-sm font-medium text-slate-700 mb-2">
                    Project Link 2 <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    id="projectLink2"
                    value={projectLink2}
                    onChange={(e) => setProjectLink2(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="https://second-project-link.com"
                  />
                </div>
              </>
            )}

            {profile && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-slate-700">Requester:</span> {profile.name} ({profile.city})
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-slate-700">Email:</span> {profile.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onUpdateProfile}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Update Profile
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  This information is automatically filled from your profile
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50">
            <div>
              {task && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !taskType || (isDoneColumn && !projectLink.trim())}
                className="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                {task ? 'Update Task' : 'Add to Queue'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
