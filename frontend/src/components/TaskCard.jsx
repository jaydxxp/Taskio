import React, { useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

export default function TaskCard({
  task,
  columnId,
  index,
  setDragOffset,
  setMousePos,
  setDragging,
  dragging,
  dropTarget,
  setDropTarget,
  getPriorityColor,
  onTaskClick
}) {
  const cardRef = useRef(null);
  const dragTimeout = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleDoubleClick = (e) => {
    
    if (e.target.closest('button')) return;
    
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  const handleMouseDown = (e) => {
    
    if (e.target.closest('button')) return;

    startPos.current = { x: e.clientX, y: e.clientY };
    
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setMousePos({ x: e.clientX, y: e.clientY });
      setDragging({
        task,
        sourceColumn: columnId,
        sourceIndex: index
      });
    }
  };

  const handleMouseMove = (e) => {

    if (dragging && dragging.task.id === task.id) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseEnter = () => {
    if (dragging && dragging.task.id !== task.id) {
      setDropTarget({ column: columnId, index });
    }
  };

  const isBeingDragged = dragging?.task?.id === task.id;
  const showDropIndicator = dropTarget?.column === columnId &&
                            dropTarget?.index === index &&
                            dragging?.task?.id !== task.id;

  return (
    <>
      {showDropIndicator && (
        <div className="h-2 bg-indigo-400 rounded-full mb-2 animate-pulse"></div>
      )}

      <div
        ref={cardRef}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        className={`bg-white rounded-2xl p-4 shadow-sm transition-all select-none ${
          isBeingDragged
            ? 'opacity-30'
            : 'hover:shadow-lg hover:scale-105 cursor-grab active:cursor-grabbing'
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex items-start justify-between mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <button className="text-gray-400 hover:text-gray-600" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        <h4 className="font-bold text-gray-900 mb-2">{task.title}</h4>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">{task.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {task.members.map((member, i) => (
              <div key={i} className="w-7 h-7 bg-gray-300 rounded-full border-2 border-white"></div>
            ))}
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <div className="flex items-center gap-1 text-xs">
              <img src='./message.svg' className="w-4 h-4" alt="messages" />
              {task.comments}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <img src='./folder-2.svg' className="w-4 h-4" alt="files" />
              {task.files}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}