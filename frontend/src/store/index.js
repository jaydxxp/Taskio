import { createSlice } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

const SAMPLE_TASKS = {
  todo: [
    {
      id: 1,
      title: 'Brainstorming',
      description: "Brainstorming brings team members' diverse experience into play.",
      priority: 'Low',
      comments: 12,
      files: 0,
      members: ['A', 'B', 'C'],
      subtasks: [],
      dueAt: null,
      createdAt: new Date().toISOString()
    }
  ],
  inProgress: [
    {
      id: 2,
      title: 'Wireframes',
      description: 'Low fidelity wireframes include the most basic content and visuals.',
      priority: 'Medium',
      comments: 8,
      files: 2,
      members: ['F', 'G'],
      subtasks: [],
      dueAt: null,
      createdAt: new Date().toISOString()
    }
  ],
  done: [
    {
      id: 3,
      title: 'Design System',
      description: 'Create a consistent system for the UI.',
      priority: 'Completed',
      comments: 5,
      files: 4,
      members: ['I'],
      subtasks: [],
      dueAt: null,
      createdAt: new Date().toISOString()
    }
  ]
};

const loadFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem('tasks_v1');
    if (!raw) return SAMPLE_TASKS;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load tasks from localStorage', e);
    return SAMPLE_TASKS;
  }
};

const initialState = loadFromLocalStorage();

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      return action.payload;
    },
    addTask: (state, action) => {
      const { columnId, task } = action.payload;
      state[columnId] = [task, ...(state[columnId] || [])];
    },
    updateTask: (state, action) => {
      const updated = action.payload;
      for (const col of ['todo', 'inProgress', 'done']) {
        if (state[col]?.some(t => t.id === updated.id)) {
          state[col] = state[col].map(t => t.id === updated.id ? updated : t);
          return;
        }
      }
    
      state.todo = [updated, ...(state.todo || [])];
    },
    removeTask: (state, action) => {
      const id = action.payload;
      for (const col of ['todo', 'inProgress', 'done']) {
        state[col] = (state[col] || []).filter(t => t.id !== id);
      }
    }
  }
});

export const { setTasks, addTask, updateTask, removeTask } = tasksSlice.actions;

const store = configureStore({
  reducer: {
    tasks: tasksSlice.reducer
  }
});

store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem('tasks_v1', JSON.stringify(state.tasks));
  } catch (e) {

    console.warn('Failed to save tasks to localStorage', e);
  }
});

export default store;