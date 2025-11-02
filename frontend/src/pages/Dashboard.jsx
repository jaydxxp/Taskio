import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask as reduxAddTask, updateTask as reduxUpdateTask, setTasks as reduxSetTasks } from '../store/taskSlice';

import Sidebar from '../components/Sidebar';
import Column from '../components/Column';
import TaskDetail from '../components/TaskDetail'; 

export default function Dashboard() {
  
  const tasks = useSelector((s) => s.tasks);
  const dispatch = useDispatch();

  
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

 
  const updateTask = (updated) => {
    dispatch(reduxUpdateTask(updated));
    setSelectedTask(updated);
  };


  const handleCreateTask = (task, columnId = 'todo') => {
    dispatch(reduxAddTask({ columnId, task }));
  };

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
              <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                <img src='./notification.svg' className="w-5 h-5 text-gray-600" alt="notifications" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3 ml-2">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">Palak Jain</div>
                  <div className="text-xs text-gray-500">Rajathan, India</div>
                </div>
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  PJ
                </div>
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
              title="On Progress"
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