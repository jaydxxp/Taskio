import React, { useEffect, useRef, useState, cloneElement } from 'react';

export default function Newtask({ onCreate, trigger, categories = ['General', 'Bug', 'Feature', 'Improvement', 'Research', 'Custom'] }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const priorities = ['Low', 'Medium', 'High', 'Completed', 'Custom'];
  const [priority, setPriority] = useState(priorities[0]);
  const [customPriority, setCustomPriority] = useState('');
  const [category, setCategory] = useState(categories[0] || 'General');
  const [customCategory, setCustomCategory] = useState('');
  const [dueDate, setDueDate] = useState(''); 
  const titleRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => titleRef.current?.focus(), 0);
      const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
  }, [open]);

  const reset = () => {
    setTitle('');
    setDescription('');
    setPriority(priorities[0]);
    setCustomPriority('');
    setCategory(categories[0] || 'General');
    setCustomCategory('');
    setDueDate('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { titleRef.current?.focus(); return; }
    const finalPriority = priority === 'Custom' ? (customPriority.trim() || 'Custom') : priority;
    const finalCategory = category === 'Custom' ? (customCategory.trim() || 'Custom') : category;

    let dueAt = null;
    if (dueDate) {
      dueAt = new Date(dueDate);
      if (!Number.isNaN(dueAt.getTime())) dueAt = dueAt.toISOString();
      else dueAt = null;
    }

    const task = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      title: title.trim(),
      description: description.trim(),
      priority: finalPriority,
      category: finalCategory,
      dueAt, 
      comments: 0,
      files: 0,
      members: []
    };
    onCreate?.(task);
    reset();
    setOpen(false);
  };

  const handleOverlayClick = (e) => { if (e.target === overlayRef.current) setOpen(false); };

 
  const triggerNode = trigger
    ? (React.isValidElement(trigger) ? cloneElement(trigger, { onClick: () => setOpen(true) }) : (
        <button onClick={() => setOpen(true)} type="button">{String(trigger)}</button>
      ))
    : (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        aria-haspopup="dialog"
        aria-expanded={open}
        type="button"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        New Task
      </button>
    );

  return (
    <>
      {triggerNode}

      {open && (
        <div
          ref={overlayRef}
          onMouseDown={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleSubmit}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl transform-gpu"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create new task</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700" aria-label="Close">✕</button>
            </div>

            <label className="block mb-3">
              <div className="text-xs font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></div>
              <input
                ref={titleRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Task title"
                required
              />
            </label>

            <label className="block mb-3">
              <div className="text-xs font-medium text-gray-700 mb-1">Description</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Short description (optional)"
                rows={3}
              />
            </label>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <div className="text-xs font-medium text-gray-700 mb-2">Priority</div>
                <div className="flex items-center gap-3">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {priority === 'Custom' && (
                    <input
                      value={customPriority}
                      onChange={(e) => setCustomPriority(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Custom priority"
                    />
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-gray-700 mb-2">Category</div>
                <div className="flex items-center gap-3">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {category === 'Custom' && (
                    <input
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Custom category"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs font-medium text-gray-700 mb-2">Due date & time (optional)</div>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {dueDate && (
                  <div className="text-xs text-gray-500 ml-2">
                    {`Set for ${dueDate}`}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={() => { reset(); setOpen(false); }} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">Create</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}