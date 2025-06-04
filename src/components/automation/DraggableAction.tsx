import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableActionProps {
  id: string;
  type: string;
  label: string;
  icon: React.ReactNode;
}

// Lightweight ghost item component
const DragOverlay = React.memo<{ label: string; icon: React.ReactNode }>(({ label, icon }) => (
  <div className="flex items-center space-x-2 p-3 bg-white/90 backdrop-blur-sm border-2 border-megen-green rounded-lg shadow-lg">
    <div className="text-megen-blue">{icon}</div>
    <span className="text-sm font-medium text-megen-blue">{label}</span>
  </div>
));

const DraggableAction: React.FC<DraggableActionProps> = ({ id, type, label, icon }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: {
      type,
      label,
      icon,
    },
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
    transition: 'transform 200ms ease-in-out',
  } : undefined;

  // Only render the full component when not dragging
  if (isDragging) {
    return <DragOverlay label={label} icon={icon} />;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center space-x-2 p-3 bg-white border rounded-lg
        transition-all duration-200 ease-in-out
        border-gray-200 hover:border-megen-green hover:shadow-sm cursor-grab
      `}
    >
      <div className="text-gray-500 transition-colors duration-200">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700">
        {label}
      </span>
    </div>
  );
};

export default React.memo(DraggableAction);