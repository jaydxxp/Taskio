import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addTask as reduxAddTask, updateTask as reduxUpdateTask, setTasks as reduxSetTasks } from '../store/taskSlice';

import Sidebar from '../components/Sidebar';
import Column from '../components/Column';
import TaskDetail from '../components/TaskDetail'; 


const normalizeTask = (t) => {
  if (!t) return null;
  return {
    id: t._id ?? t.id ?? `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    title: t.title ?? '',
    description: t.description ?? '',
    
    priority: typeof t.priority === 'number' ? t.priority : (t.priority ?? 'Medium'),
    comments: t.comments ?? 0,
    files: t.files ?? 0,
    members: t.members ?? [],
    subtasks: t.subtasks ?? [],
    dueAt: t.dueDate ?? t.dueAt ?? t.due ?? null,
    status: t.status ?? 'todo',
    _raw: t
  };
};


const normalizeGroup = (g) => {
  if (!g) return { todo: [], inProgress: [], done: [] };

  
  if (g.todo && g.inProgress && g.done) {
    return {
      todo: (g.todo || []).map(normalizeTask),
      inProgress: (g.inProgress || []).map(normalizeTask),
      done: (g.done || []).map(normalizeTask)
    };
  }


  if (Array.isArray(g)) {
    const grouped = { todo: [], inProgress: [], done: [] };
    g.forEach(t => {
      const s = String(t.status || t.state || 'todo');
      if (s === 'inProgress') grouped.inProgress.push(normalizeTask(t));
      else if (s === 'done') grouped.done.push(normalizeTask(t));
      else grouped.todo.push(normalizeTask(t));
    });
    return grouped;
  }

  
  if (Array.isArray(g.tasks)) return normalizeGroup(g.tasks);

  return { todo: [], inProgress: [], done: [] };
};

export default function Dashboard() {
  const BACKEND = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');
  
  const [user, setUser] = useState(null);
  const tasks = useSelector((s) => s.tasks);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  
 
  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${BACKEND}/api/v1/user/me`, { headers, timeout: 5000 });
        if (!cancelled && res?.data) setUser(res.data);
      } catch (err) {
        console.log("something went wrong")
      }
    })();
    return () => { cancelled = true; };
  }, [BACKEND]);

 
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signup');
      }
    } catch (e) {
      
      navigate('/signup');
    }
  }, [navigate]);

  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dropTarget, setDropTarget] = useState(null);
  

  const [filterPriority, setFilterPriority] = useState('All');
  const [filterDate, setFilterDate] = useState(''); 
  const [showPriorityPopover, setShowPriorityPopover] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const PRIORITIES = ['All', 'Low', 'Medium', 'High', 'Completed'];
  const [selectedTask, setSelectedTask] = useState(null);

 
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

 
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('notifs_v1');
      if (raw) setNotifications(JSON.parse(raw));
    } catch (e) {
      
    }
  }, []);

 
  useEffect(() => {
    if (!tasks) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const d = String(tomorrow.getDate()).padStart(2, '0');
    const target = `${y}-${m}-${d}`;

    const dueTasks = [];
    ['todo', 'inProgress', 'done'].forEach((col) => {
      (tasks[col] || []).forEach((t) => {
        if (!t) return;
        const dateStr = (typeof t.dueAt === 'string') ? t.dueAt.slice(0, 10) : (t.dueAt ? new Date(t.dueAt).toISOString().slice(0,10) : null);
        if (dateStr === target) dueTasks.push(t);
      });
    });

    if (dueTasks.length === 0) return;

   
    let existing = [];
    try {
      existing = JSON.parse(sessionStorage.getItem('notifs_v1') || '[]');
    } catch (e) { existing = []; }

   
    const newNotifs = [];
    dueTasks.forEach((t) => {
      const already = existing.find(n => n.taskId === t.id) || notifications.find(n => n.taskId === t.id);
      if (!already) {
        newNotifs.push({ id: `n-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, taskId: t.id, title: t.title || 'Untitled task', dueAt: t.dueAt });
      }
    });

    if (newNotifs.length > 0) {
      const merged = [...newNotifs, ...existing];
      setNotifications(merged);
      try { sessionStorage.setItem('notifs_v1', JSON.stringify(merged)); } catch (e) { }
    }
  }, [tasks]);


  useEffect(() => {
    if (!showNotifications) return;
    const onDoc = () => setShowNotifications(false);
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [showNotifications]);

  const toggleNotifications = (e) => { e.stopPropagation(); setShowNotifications(v => !v); };
  const handleCloseNotification = (id) => {
    const filtered = notifications.filter(n => n.id !== id);
    setNotifications(filtered);
    try { sessionStorage.setItem('notifs_v1', JSON.stringify(filtered)); } catch (e) { }
  };
  const handleClearNotifications = () => {
    setNotifications([]);
    try { sessionStorage.removeItem('notifs_v1'); } catch (e) {  }
  };

  
  useEffect(() => {
    if (!showProfileMenu) return;

    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    const onKey = (e) => { 
      if (e.key === 'Escape') setShowProfileMenu(false); 
    };
    
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [showProfileMenu]);

const handleLogout = () => {
  try { 
    localStorage.clear(); 
  } catch (e) {
    console.error('Failed to clear localStorage:', e);
  }
  setShowProfileMenu(false);
  navigate('/');
};
  useEffect(() => {
    const onDocClick = (e) => {
      if (showPriorityPopover || showDatePicker) {
        setShowPriorityPopover(false);
        setShowDatePicker(false);
      }
    };
    const onKey = (e) => { 
      if (e.key === 'Escape') { 
        setShowPriorityPopover(false); 
        setShowDatePicker(false); 
      } 
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [showPriorityPopover, showDatePicker]);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-600';
      case 'Low': return 'bg-orange-100 text-orange-600';
      case 'Completed': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    if (dragging && dropTarget) {
      const newTasks = {
        todo: [...(tasks?.todo || [])],
        inProgress: [...(tasks?.inProgress || [])],
        done: [...(tasks?.done || [])]
      };

      
      newTasks[dragging.sourceColumn] = newTasks[dragging.sourceColumn].filter(t => t.id !== dragging.task.id);

  
      if (typeof dropTarget.index === 'number') {
        newTasks[dropTarget.column].splice(dropTarget.index, 0, dragging.task);
      } else {
        newTasks[dropTarget.column].push(dragging.task);
      }

      dispatch(reduxSetTasks(newTasks));
      try { localStorage.setItem('tasks_v1', JSON.stringify(newTasks)); } catch (e) { }

  
      (async () => {
        try {
          const token = localStorage.getItem('token') || '';
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const moved = { ...dragging.task, status: dropTarget.column };
         
          await axios.put(`${BACKEND}/api/v1/task/${moved.id}`, { status: dropTarget.column }, { headers, timeout: 8000 });
        } catch (err) {
       
          console.warn('Failed to persist moved task', err?.message || err);
      
        }
      })();
    }

    setDragging(null);
    setDropTarget(null);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, dropTarget]);

  const filterColumnTasks = (colName) => {
    return (tasks?.[colName] || []).filter(t => {
      if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
      if (filterDate) {
        if (!t.dueAt) return false;
        const taskDate = (typeof t.dueAt === 'string' ? t.dueAt.slice(0,10) : new Date(t.dueAt).toISOString().slice(0,10));
        if (taskDate !== filterDate) return false;
      }
      return true;
    });
  };

 
  const updateTask = async (updated) => {
    try {
      
      dispatch(reduxUpdateTask(updated));
      try { 
        const current = JSON.parse(localStorage.getItem('tasks_v1') || '{}');
        
        if (current) {
          ['todo','inProgress','done'].forEach(col => {
            if (Array.isArray(current[col])) {
              current[col] = current[col].map(t => (t.id === updated.id ? updated : t));
            }
          });
          try { localStorage.setItem('tasks_v1', JSON.stringify(current)); } catch(e){}
        }
      } catch(e){}
      
    
      const token = localStorage.getItem('token') || '';
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const payload = {
        description: updated.description,
        subtasks: updated.subtasks,
        status: updated.status,
        priority: updated.priority,
        dueDate: updated.dueAt || updated.dueDate || null,
        category: updated.category
      };
    
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      await axios.put(`${BACKEND}/api/v1/task/${updated.id}`, payload, { headers, timeout: 8000 });
    } catch (err) {
   
      console.error('Failed to persist updated task', err?.message || err);
      
    } finally {
      setSelectedTask(updated);
    }
  };

 
  const handleCreateTask = (task, columnId = 'todo') => {
    const normalized = normalizeTask(task);
    if (!normalized) return;
    dispatch(reduxAddTask({ columnId, task: normalized }));
  };

  useEffect(() => {
    
    try {
      const raw = localStorage.getItem('tasks_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        const normalized = normalizeGroup(parsed);
        const reduxEmpty = !tasks || (Object.keys(tasks).length === 0);
        if (reduxEmpty) {
          dispatch(reduxSetTasks(normalized));
        }
      }
    } catch (err) {
      
      console.warn('Failed to parse cached tasks_v1', err);
    }


    let cancelled = false;
    (async () => {
      const token = localStorage.getItem('token') || '';
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const candidates = [
        `${BACKEND}/api/v1/task`,
        `${BACKEND}/api/v1/task/list`,
        `${BACKEND}/api/v1/tasks`
      ];

      const normalize = (data) => {
        if (!data) return { todo: [], inProgress: [], done: [] };
        
        if (data.todo && data.inProgress && data.done) return data;
   
        if (Array.isArray(data)) {
          const grouped = { todo: [], inProgress: [], done: [] };
          data.forEach(t => {
            const s = String(t.status || t.state || 'todo');
            if (s === 'inProgress') grouped.inProgress.push(t);
            else if (s === 'done') grouped.done.push(t);
            else grouped.todo.push(t);
          });
          return grouped;
        }
       
        if (Array.isArray(data.tasks)) return normalize(data.tasks);
       
        return { todo: [], inProgress: [], done: [] };
      };

      for (const url of candidates) {
        try {
          const res = await axios.get(url, { headers, timeout: 8000 });
          if (cancelled) return;
          const fetched = normalize(res.data);
          
          const normalizedFetched = normalizeGroup(fetched);
          const cachedRaw = localStorage.getItem('tasks_v1');
          const cached = cachedRaw ? JSON.parse(cachedRaw) : null;
          const same = JSON.stringify(cached) === JSON.stringify(normalizedFetched);
          if (!same) {
            dispatch(reduxSetTasks(normalizedFetched));
            try { localStorage.setItem('tasks_v1', JSON.stringify(normalizedFetched)); } catch (e) {  }
          }
          break; 
        } catch (err) {
    
          console.warn('Tasks fetch failed for', url, err?.message || err);
        }
      }
    })();

    return () => { cancelled = true; };
  }, []); 

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <img src='./search-normal.svg' className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" alt="search" />
                <input
                  type="text"
                  placeholder="Search for anything..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-6">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <img src='./calendar-2.svg' className="w-5 h-5 text-gray-600" alt="calendar" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <img src='./message-question.svg' className="w-5 h-5 text-gray-600" alt="help" />
              </button>
              <div className="relative">
                <button type="button" onClick={toggleNotifications} className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                  <img src='./notification.svg' className="w-5 h-5 text-gray-600" alt="notifications" />
                  {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>}
                </button>

                {showNotifications && (
                  <div onClick={(e) => e.stopPropagation()} className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                      <div className="text-sm font-semibold">Notifications</div>
                      <div className="text-xs text-gray-500">{notifications.length} new</div>
                    </div>
                    <div className="max-h-60 overflow-auto">
                      {notifications.length === 0 && (
                        <div className="p-4 text-sm text-gray-600">No notifications</div>
                      )}
                      {notifications.map(n => (
                        <div key={n.id} className="p-3 flex items-start justify-between border-b border-gray-50">
                          <div>
                            <div className="text-sm font-medium">{n.title}</div>
                            <div className="text-xs text-gray-500">Due: {(n.dueAt || '').slice(0,10)}</div>
                          </div>
                          <div className="ml-3 shrink-0">
                            <button type="button" onClick={() => handleCloseNotification(n.id)} className="text-xs text-gray-500 hover:text-gray-700">Close</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 border-t border-gray-100 flex justify-end gap-2">
                      <button type="button" onClick={handleClearNotifications} className="text-sm text-gray-600">Clear All</button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative flex items-center gap-3 ml-2" ref={profileRef}>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(v => !v)}
                  className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold"
                  aria-haspopup="true"
                  aria-expanded={showProfileMenu}
                >
                  {(user?.name ? user.name.split(' ').map(s => s[0]).slice(0,2).join('') : 'US')}
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 top-12 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

      
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-gray-900">Mobile App</h2>
                <button className="rounded-md transition">
                  <img src='./arrow-square-up.svg' className='h-8.5 w-8.5' alt="upload" />
                </button>
                <button className="p-1 bg-[#D7D2F8] rounded-md transition">
                  <img src='./link.svg' className='w-5 h-5' alt="link" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 px-4 py-2 rounded-lg transition">
                  <img src='./add-square.svg' className="w-4 h-4" alt="add" />
                  Invite
                </button>
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold">A</div>
                  <div className="w-9 h-9 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold">B</div>
                  <div className="w-9 h-9 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold">C</div>
                  <div className="w-9 h-9 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold">D</div>
                  <div className="w-9 h-9 bg-pink-200 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-xs font-semibold">+2</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
       
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowPriorityPopover(v => !v); setShowDatePicker(false); }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  type="button"
                >
                  <img src='./filter.svg' className="w-4 h-4" alt="filter" />
                  Filter
                </button>
                {showPriorityPopover && (
                  <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md z-50 p-3" onClick={(e) => e.stopPropagation()}>
                    <label className="text-xs font-medium text-gray-600">Priority</label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="w-full mt-2 px-2 py-2 border border-gray-200 rounded-md text-sm"
                    >
                      {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <div className="mt-2 flex justify-end gap-2">
                      <button type="button" onClick={() => { setFilterPriority('All'); setShowPriorityPopover(false); }} className="text-sm text-gray-600">Clear</button>
                      <button type="button" onClick={() => setShowPriorityPopover(false)} className="text-sm text-indigo-600">Done</button>
                    </div>
                  </div>
                )}
              </div>

             
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowDatePicker(v => !v); setShowPriorityPopover(false); }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  type="button"
                >
                  <img src='./calendar.svg' className="w-4 h-4" alt="calendar" />
                  Today
                </button>
                {showDatePicker && (
                  <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md z-50 p-3" onClick={(e) => e.stopPropagation()}>
                    <label className="text-xs font-medium text-gray-600">Due date</label>
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="w-full mt-2 px-2 py-2 border border-gray-200 rounded-md text-sm"
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button type="button" onClick={() => { setFilterDate(''); setShowDatePicker(false); }} className="text-sm text-gray-600">Clear</button>
                      <button type="button" onClick={() => setShowDatePicker(false)} className="text-sm text-indigo-600">Done</button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex-1"></div>
              
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                <img src='/users.svg' className="w-4 h-4" alt="users" />
                Share
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2">
                <img src='/pause.svg' className='w-4 h-4' alt="pause" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <img src='/home.svg' className="w-5 h-5 text-gray-600" alt="home" />
              </button>
            </div>
          </div>

      
          <div className="grid grid-cols-3 gap-6">
            <Column
              title="To Do"
              columnId="todo"
              color="text-purple-600"
              dotColor="bg-purple-600"
              tasks={filterColumnTasks('todo')}
              dragging={dragging}
              setDropTarget={setDropTarget}
              setDragging={setDragging}
              setDragOffset={setDragOffset}
              setMousePos={setMousePos}
              dropTarget={dropTarget}
              getPriorityColor={getPriorityColor}
              onTaskClick={setSelectedTask}
              onCreate={(task, colId) => handleCreateTask(task, colId)}
            />
            <Column
              title="In Progress"
              columnId="inProgress"
              color="text-orange-500"
              dotColor="bg-orange-500"
              tasks={filterColumnTasks('inProgress')}
              dragging={dragging}
              setDropTarget={setDropTarget}
              setDragging={setDragging}
              setDragOffset={setDragOffset}
              setMousePos={setMousePos}
              dropTarget={dropTarget}
              getPriorityColor={getPriorityColor}
              onTaskClick={setSelectedTask}
              onCreate={(task, colId) => handleCreateTask(task, colId)}
            />
            <Column
              title="Done"
              columnId="done"
              color="text-green-500"
              dotColor="bg-green-500"
              tasks={filterColumnTasks('done')}
              dragging={dragging}
              setDropTarget={setDropTarget}
              setDragging={setDragging}
              setDragOffset={setDragOffset}
              setMousePos={setMousePos}
              dropTarget={dropTarget}
              getPriorityColor={getPriorityColor}
              onTaskClick={setSelectedTask}
              onCreate={(task, colId) => handleCreateTask(task, colId)}
            />
          </div>
        </div>
      </div>


      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          getPriorityColor={getPriorityColor}
          onUpdate={(updated) => updateTask(updated)}
        />
      )}
    </div>
  );
}