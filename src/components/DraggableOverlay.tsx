import { useState, useRef, useCallback } from 'react';
import Draggable, { DraggableData } from 'react-draggable';
import { Trash2, GripVertical } from 'lucide-react';
import { Overlay } from '../services/api';

interface Props {
  overlay: Overlay;
  onUpdate: (id: string, updates: Partial<Overlay>) => void;
  onDelete: (id: string) => void;
}

export default function DraggableOverlay({ overlay, onUpdate, onDelete }: Props) {
  if (!overlay?.id) return null;

  const [localSize, setLocalSize] = useState(overlay.size);
  const [localPosition, setLocalPosition] = useState(overlay.position);
  const resizing = useRef(false);
  const start = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const animationFrame = useRef<number>();

  const onDragStop = (_: any, data: DraggableData) => {
    onUpdate(overlay.id, { position: { x: data.x, y: data.y } });
  };

  const onDrag = (_: any, data: DraggableData) => {
    // Update position in real-time for smooth dragging
    setLocalPosition({ x: data.x, y: data.y });
  };

  const onResize = (e: MouseEvent) => {
    if (!resizing.current) return;
    if (animationFrame.current) return; // Throttle updates
    animationFrame.current = requestAnimationFrame(() => {
      const newSize = {
        width: Math.max(100, start.current.w + (e.clientX - start.current.x)),
        height: Math.max(50, start.current.h + (e.clientY - start.current.y)),
      };
      setLocalSize(newSize);
      animationFrame.current = undefined;
    });
  };

  const startResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    resizing.current = true;
    start.current = {
      x: e.clientX,
      y: e.clientY,
      w: localSize.width,
      h: localSize.height,
    };

    document.addEventListener('mousemove', resizeMove);
    document.addEventListener('mouseup', stopResize);
  };

  const resizeMove = useCallback((e: MouseEvent) => {
    onResize(e);
  }, []);

  const stopResize = () => {
    resizing.current = false;
    onUpdate(overlay.id, { size: localSize });
    document.removeEventListener('mousemove', resizeMove);
    document.removeEventListener('mouseup', stopResize);
  };

  return (
    <Draggable
      position={localPosition}
      onStop={onDragStop}
      onDrag={onDrag}
      bounds="parent"
    >
      <div
        className="absolute group select-none"
        style={{ width: localSize.width, height: localSize.height }}
      >
        <div className="w-full h-full border-2 border-dashed border-white/60
                        bg-black/40 rounded-lg relative flex items-center justify-center">

          {/* Drag */}
          <div className="drag-handle absolute top-1 left-1 p-1
                          bg-black/60 rounded cursor-move
                          opacity-0 group-hover:opacity-100">
            <GripVertical className="w-4 h-4 text-white" />
          </div>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(overlay.id);
            }}
            className="absolute top-1 right-1 p-1 bg-red-500 rounded
                       opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>

          {/* Content */}
          {overlay.type === 'text' ? (
            <span className="text-white font-semibold text-center px-2 break-words">
              {overlay.content}
            </span>
          ) : (
            <img
              src={overlay.content}
              className="max-w-full max-h-full object-contain"
              alt="overlay"
            />
          )}

          {/* Resize */}
          <div
            onMouseDown={startResize}
            className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500
                       cursor-se-resize opacity-0 group-hover:opacity-100"
          />
        </div>
      </div>
    </Draggable>
  );
}
