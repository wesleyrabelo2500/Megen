import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';

interface DropZoneProps {
  id: string;
}

const DropZone: React.FC<DropZoneProps> = ({ id }) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex items-center justify-center h-16 w-full
        transition-all duration-200 ease-in-out
        ${active ? 'opacity-100' : 'opacity-0 hover:opacity-100'}
      `}
    >
      <div className={`
        relative flex items-center justify-center w-8 h-8 rounded-full
        transition-all duration-200 ease-in-out transform
        ${isOver 
          ? 'bg-megen-green scale-125 border-2 border-megen-blue' 
          : 'bg-gray-100 hover:bg-gray-200'
        }
        ${active ? 'scale-110' : ''}
      `}>
        <Plus 
          className={`
            w-4 h-4 transition-colors duration-200
            ${isOver ? 'text-megen-blue' : 'text-gray-400'}
          `} 
        />
        {isOver && (
          <div className="absolute inset-0 animate-ping rounded-full bg-megen-green opacity-75" />
        )}
      </div>
    </div>
  );
};

export default DropZone;