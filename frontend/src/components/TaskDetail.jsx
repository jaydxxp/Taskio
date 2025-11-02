import React, { useEffect, useState } from 'react';
import { X, Calendar, User, Paperclip, MessageSquare, Flag } from 'lucide-react';

export default function TaskDetail({ task, onClose, getPriorityColor, onUpdate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [description, setDescription] = useState(task?.description || '');
  const [members, setMembers] = useState(task?.members || []);
  const [files, setFiles] = useState(task?.files || 0);
  const [comments, setComments] = useState(task?.comments || 0);
  const [status, setStatus] = useState(task?.status || 'inProgress');

  useEffect(() => {
    setSubtasks(task?.subtasks || []);
    setNewSubtask('');
    setDescription(task?.description || '');
    setMembers(task?.members || []);
    setFiles(task?.files || 0);
    setComments(task?.comments || 0);
    setStatus(task?.status || 'inProgress');
  }, [task]);

  if (!task) return null;

  const addSubtask = () => {
    const title = (newSubtask || '').trim();
    if (!title) return;
    const next = [
      ...subtasks,
      { id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`, title, completed: false, createdAt: new Date().toISOString() }
    ];
    setSubtasks(next);
    setNewSubtask('');
  };

  const toggleSubtask = (id) => {
    setSubtasks(prev => prev.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
  };

  const deleteSubtask = (id) => {
    setSubtasks(prev => prev.filter(st => st.id !== id));
  };

  const completedCount = subtasks.filter(s => s.completed).length;
  const progressPercent = subtasks.length ? Math.round((completedCount / subtasks.length) * 100) : 0;

  const handleSave = () => {
    const updated = {
      ...task,
      subtasks,
      description,
      members,
      files,
      comments,
      status
    };
    onUpdate?.(updated);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-start justify-between p-6 border-b border-gray-200 bg-violet-600 text-white">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getPriorityColor?.(task.priority) ?? 'bg-gray-100 text-gray-800'}`}>
                {task.priority}
              </span>
              <div className="text-xs opacity-80">Created on {new Date(task.createdAt || Date.now()).toLocaleDateString()}</div>
            </div>
            <h2 className="text-2xl font-bold">{task.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

   
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            {['overview', 'subtasks', 'comments', 'files'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-2 text-sm font-medium capitalize transition-all ${activeTab === tab ? 'border-b-2 border-violet-600 text-gray-900' : 'text-gray-500'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Team Members</h3>
                  <div className="flex flex-wrap gap-2">
                    {members.length === 0 && <div className="text-sm text-gray-500">No members assigned</div>}
                    {members.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {String(m)?.[0] ?? String.fromCharCode(65 + i)}
                        </div>
                        <div className="text-sm font-medium text-gray-700">{m}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2"><Flag className="w-4 h-4" /> Status Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="text-sm text-gray-600">Priority</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded ${getPriorityColor?.(task.priority) ?? 'bg-gray-100 text-gray-700'}`}>
                        {task.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="text-sm text-gray-600">Status</span>
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-sm">
                        <option value="todo">To Do</option>
                        <option value="inProgress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="text-sm text-gray-600">Due Date</span>
                      <div className="text-sm text-gray-800">{task.dueAt ? new Date(task.dueAt).toLocaleDateString() : 'Not set'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Activity Summary</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{comments}</div>
                      <div className="text-xs text-gray-600">Comments</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{files}</div>
                      <div className="text-xs text-gray-600">Files</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{progressPercent}%</div>
                      <div className="text-xs text-gray-600">Progress</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subtasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Subtasks</h3>
                <span className="text-sm text-gray-600">{completedCount} of {subtasks.length} completed</span>
              </div>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addSubtask(); }}
                  placeholder="Add a new subtask..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button onClick={addSubtask} className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm">Add</button>
              </div>

              <div className="space-y-2">
                {subtasks.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">No subtasks yet. Add one to get started!</div>
                ) : (
                  subtasks.map((st) => (
                    <div key={st.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <input type="checkbox" checked={st.completed} onChange={() => toggleSubtask(st.id)} className="w-5 h-5 rounded cursor-pointer" />
                      <div className={`flex-1 text-sm ${st.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{st.title}</div>
                      <button onClick={() => deleteSubtask(st.id)} className="text-red-500 hover:text-red-700 p-1"><X className="w-4 h-4" /></button>
                    </div>
                  ))
                )}
              </div>

              {subtasks.length > 0 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No comments yet. Be the first to comment!</p>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex-shrink-0"></div>
                <textarea className="flex-1 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" rows={3} placeholder="Write a comment..." />
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="text-center py-8 text-gray-500">
              <Paperclip className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No files attached yet.</p>
              <button className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">Upload Files</button>
            </div>
          )}
        </div>

      
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}