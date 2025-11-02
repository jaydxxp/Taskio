import React from 'react';
import TaskCard from './TaskCard';
import Newtask from './Newtask';

export default function Column({
  title,
  columnId,
  color,
  dotColor,
  tasks,
  dragging,
  setDropTarget,
  setDragging,
  setDragOffset,
  setMousePos,
  dropTarget,
  getPriorityColor,
  onTaskClick,
  onCreate
}) {
  const handleColumnMouseEnter = () => {
    if (dragging && tasks.length === 0) {
      setDropTarget({ column: columnId, index: 0 });
    }
  };

  const isOverColumn = dropTarget?.column === columnId;

  return (
    <div
      onMouseEnter={handleColumnMouseEnter}
      className={`bg-gray-100 rounded-2xl p-5 transition-all ${isOverColumn && dragging ? 'ring-2 ring-indigo-400 bg-indigo-50' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 ${dotColor} rounded-full`}></div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Newtask
            onCreate={(task) => onCreate?.(task, columnId)}
            trigger={
              <button
                type="button"
                aria-label={`Add task to ${title}`}
                className={`${color} bg-white hover:bg-gray-50 rounded-lg p-1 transition`}
              >
                <img src='./add-square.svg' className='w-5 h-5'/>
              </button>
            }
          />
        </div>
      </div>

      <div className={`h-1 ${color.replace('text-', 'bg-')} rounded-full mb-4`}></div>

      <div className="space-y-4 min-h-[200px]">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={columnId}
            index={index}
            setDragOffset={setDragOffset}
            setMousePos={setMousePos}
            setDragging={setDragging}
            dragging={dragging}
            dropTarget={dropTarget}
            setDropTarget={setDropTarget}
            getPriorityColor={getPriorityColor}
            onTaskClick={onTaskClick}
          />
        ))}

        {isOverColumn && dragging && tasks.length === 0 && (
          <div className="h-32 border-2 border-dashed border-indigo-300 rounded-2xl flex items-center justify-center text-indigo-400 text-sm">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}