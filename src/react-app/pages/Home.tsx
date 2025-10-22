import { useState, useEffect } from 'react';
import { BoardWithColumns, UserProfile, CreateUserProfile } from '@/shared/types';
import KanbanBoard from '@/react-app/components/KanbanBoard';
import ProfileSetupModal from '@/react-app/components/ProfileSetupModal';
import DeleteBoardModal from '@/react-app/components/DeleteBoardModal';
import { exportBoardToExcel } from '@/react-app/utils/exportToExcel';
import ExportModal from '@/react-app/components/ExportModal';
import { Loader2, Plus, Layers, FileSpreadsheet, Trash2 } from 'lucide-react';

export default function Home() {
  const [boards, setBoards] = useState<BoardWithColumns[]>([]);
  const [currentBoard, setCurrentBoard] = useState<BoardWithColumns | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showDeleteBoard, setShowDeleteBoard] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');

  useEffect(() => {
    loadProfile();
    loadBoards();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const profileData = await response.json();
      setProfile(profileData);
      
      // Show profile setup if no profile exists
      if (!profileData) {
        setShowProfileSetup(true);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const loadBoards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/boards');
      if (!response.ok) throw new Error('Failed to fetch boards');
      
      const boardsList = await response.json();
      setBoards(boardsList);
      
      // If no current board and boards exist, load the first one
      if (!currentBoard && boardsList.length > 0) {
        loadBoard(boardsList[0].id);
      } else if (boardsList.length === 0) {
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load boards');
      setLoading(false);
    }
  };

  const loadBoard = async (boardId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/boards/${boardId}`);
      if (!response.ok) throw new Error('Failed to fetch board');
      
      const board = await response.json();
      setCurrentBoard(board);
      setLoading(false);
    } catch (err) {
      setError('Failed to load board');
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBoardName.trim()) return;

    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newBoardName.trim(),
          description: newBoardDescription.trim() || undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to create board');

      const newBoard = await response.json();
      await loadBoards();
      await loadBoard(newBoard.id);
      
      setShowCreateBoard(false);
      setNewBoardName('');
      setNewBoardDescription('');
    } catch (err) {
      setError('Failed to create board');
    }
  };

  const handleUpdateBoard = (updatedBoard: BoardWithColumns) => {
    setCurrentBoard(updatedBoard);
  };

  const handleSaveProfile = async (profileData: CreateUserProfile) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error('Failed to save profile');

      const newProfile = await response.json();
      setProfile(newProfile);
      setShowProfileSetup(false);
    } catch (err) {
      setError('Failed to save profile');
    }
  };

  const handleUpdateProfile = () => {
    setShowProfileSetup(true);
  };

  const handleDeleteBoard = async () => {
    if (!currentBoard) return;

    try {
      const response = await fetch(`/api/boards/${currentBoard.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete board');

      setShowDeleteBoard(false);
      
      // Reload boards and select the first available one
      await loadBoards();
      const updatedBoards = boards.filter(b => b.id !== currentBoard.id);
      if (updatedBoards.length > 0) {
        await loadBoard(updatedBoards[0].id);
      } else {
        setCurrentBoard(null);
      }
    } catch (err) {
      setError('Failed to delete board');
    }
  };

  const handleExportToExcel = () => {
    if (!currentBoard) return;
    exportBoardToExcel(currentBoard);
    setShowExportModal(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin mb-4">
          <Loader2 className="w-10 h-10 text-blue-600" />
        </div>
        <p className="text-slate-600">Loading your boards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <Layers className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Something went wrong</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadBoards();
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="mb-8">
            <Layers className="w-24 h-24 text-slate-300 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-slate-800 mb-4 text-center leading-tight">Stirling Schools Marketing Task Board</h1>
            <p className="text-lg text-slate-600 text-center">A real-time queue system for marketing tasks</p>
          </div>
          
          <button
            onClick={() => setShowCreateBoard(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Create Your First Board
          </button>
        </div>

        {showCreateBoard && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <form onSubmit={handleCreateBoard}>
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-800">Create New Board</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label htmlFor="boardName" className="block text-sm font-medium text-slate-700 mb-2">
                      Board Name *
                    </label>
                    <input
                      type="text"
                      id="boardName"
                      value={newBoardName}
                      onChange={(e) => setNewBoardName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter board name..."
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <label htmlFor="boardDescription" className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="boardDescription"
                      value={newBoardDescription}
                      onChange={(e) => setNewBoardDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Enter board description..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateBoard(false);
                      setNewBoardName('');
                      setNewBoardDescription('');
                    }}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newBoardName.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Create Board
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex flex-col items-center gap-3 md:flex-row md:gap-4">
            <div className="flex items-center gap-2">
              <img 
                src="https://mocha-cdn.com/019a0a88-0d54-763c-b79e-3983b4b4da88/stir-logo-png-.png" 
                alt="Stirling Schools Logo" 
                className="w-8 h-8"
              />
              <span className="font-bold text-xl text-slate-800">Stirling Schools Marketing Dep.</span>
            </div>
            
            <div className="hidden md:block h-6 w-px bg-slate-300"></div>
            
            <select
              value={currentBoard?.id || ''}
              onChange={(e) => loadBoard(parseInt(e.target.value))}
              className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            {profile && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-600">Welcome back, <span className="font-semibold text-slate-800">{profile.name}!</span></span>
                <span className="text-slate-400">👋</span>
              </div>
            )}
            {currentBoard && (
              <>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export Report
                </button>
                <button
                  onClick={() => setShowDeleteBoard(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Board
                </button>
              </>
            )}
            <button
              onClick={() => setShowCreateBoard(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              New Board
            </button>
          </div>
        </div>
      </nav>

      {/* Board Content */}
      {currentBoard && (
        <KanbanBoard
          board={currentBoard}
          profile={profile}
          onUpdateBoard={handleUpdateBoard}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* Profile Setup Modal */}
      {showProfileSetup && (
        <ProfileSetupModal onSave={handleSaveProfile} />
      )}

      {/* Delete Board Modal */}
      {showDeleteBoard && currentBoard && (
        <DeleteBoardModal
          boardName={currentBoard.name}
          onConfirm={handleDeleteBoard}
          onClose={() => setShowDeleteBoard(false)}
        />
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          onConfirm={handleExportToExcel}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Create Board Modal */}
      {showCreateBoard && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateBoard(false);
              setNewBoardName('');
              setNewBoardDescription('');
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <form onSubmit={handleCreateBoard}>
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Create New Board</h2>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="boardName" className="block text-sm font-medium text-slate-700 mb-2">
                    Board Name *
                  </label>
                  <input
                    type="text"
                    id="boardName"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter board name..."
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="boardDescription" className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="boardDescription"
                    value={newBoardDescription}
                    onChange={(e) => setNewBoardDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Enter board description..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateBoard(false);
                    setNewBoardName('');
                    setNewBoardDescription('');
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newBoardName.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
