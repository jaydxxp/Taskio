import React, { useEffect, useState } from 'react';

export default function TaskDetail({ task, onClose, getPriorityColor, onUpdate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [description, setDescription] = useState(task?.description || '');
  const [members, setMembers] = useState(task?.members || []);
  const [files, setFiles] = useState(task?.files || 0);
  const [status, setStatus] = useState(task?.status || 'inProgress');

  useEffect(() => {
    setSubtasks(task?.subtasks || []);
    setNewSubtask('');
    setDescription(task?.description || '');
    setMembers(task?.members || []);
    setFiles(task?.files || 0);
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

  const handleSave = async () => {
    const updated = {
      ...task,
      subtasks,
      description,
      members,
      files,
      status
    };
    try {
      if (onUpdate) await onUpdate(updated);
    } catch (e) {

    }
    onClose?.();
  };

  const postComment = async (text) => {
    if (!text || !text.trim()) return;
    const payloadText = text.trim();


    const optimistic = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      taskId: task.id,
      text: payloadText,
      authorId: sessionStorage.getItem('user_id') || localStorage.getItem('user_id') || null,
      authorName: sessionStorage.getItem('user_name') || localStorage.getItem('user_name') || null,
      createdAt: new Date().toISOString()
    };

    

  
    try {
      const token = localStorage.getItem('token') || '';
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${(import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '')}/api/v1/task/${task.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ text: payloadText })
      });
      if (res.ok) {
        const json = await res.json();
        setComments(prev => prev.map(c => c.id === optimistic.id ? json : c));
      }
    } catch (e) {
     
    }
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
            className="p-2.5 cursor-pointer rounded-full transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            {['overview', 'subtasks'].map((tab) => (
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
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Members</h3>
                  <div className="flex gap-2 items-center">
                    {(members || []).map((m, i) => <div key={i} className="px-3 py-1 bg-gray-100 rounded-md text-sm">{m.name || m}</div>)}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Due</h3>
                  <div className="text-sm text-gray-700">{task.dueAt ? new Date(task.dueAt).toLocaleDateString() : 'Not set'}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subtasks' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} className="flex-1 border px-3 py-2 rounded-lg" placeholder="New subtask" />
                <button onClick={addSubtask} className="px-4 py-2 bg-violet-600 text-white rounded-lg">Add</button>
              </div>
              <div className="space-y-2">
                {subtasks.map(st => (
                  <div key={st.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={!!st.completed} onChange={() => toggleSubtask(st.id)} />
                        <span className="ml-2">{st.title}</span>
                      </label>
                    </div>
                    <div className="text-sm text-gray-400">
                      <button onClick={() => deleteSubtask(st.id)} className="text-red-500">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-500">Progress: {progressPercent}%</div>
            </div>
          )}

          

          {activeTab === 'files' && (
            <div className="text-center py-8 text-gray-500">
              <div className="w-12 h-12 mx-auto mb-3 text-gray-300">📎</div>
              <p className="text-sm">No files attached yet.</p>
              <button className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">Upload Files</button>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-3">
              {(!activity || activity.length === 0) ? (
                <div className="text-center py-6 text-gray-500">No activity yet.</div>
              ) : (
                (activity || []).slice().reverse().map((a, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-gray-700">
                        {a.type === 'comment' ? 'Commented' : a.type === 'create' ? 'Created' : a.type === 'update' ? 'Updated' : a.type === 'delete' ? 'Deleted' : a.type}
                        {a.task && a.task.title ? ` — ${a.task.title}` : ''}
                      </div>
                      <div className="text-xs text-gray-400">{new Date(a.ts || Date.now()).toLocaleString()}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      by {a.actorId || a.actorName || 'unknown'} {a.changes ? `· changes: ${Object.keys(a.changes || {}).join(', ')}` : ''}
                    </div>
                    {a.comment && <div className="mt-2 text-sm text-gray-800">{a.comment.text}</div>}
                  </div>
                ))
              )}
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