import React, { useEffect, useRef } from 'react';

export interface ContextMenuItem {
  label?: string;
  action?: () => void;
  type?: 'separator';
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        // We use setTimeout to avoid the same click event that opened the menu from closing it.
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('contextmenu', handleClickOutside);
        }, 0);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('contextmenu', handleClickOutside);
        };
    }, [onClose]);

    const handleItemClick = (item: ContextMenuItem) => {
        if(item.action) {
            item.action();
        }
        onClose();
    };
    
    const style = {
        top: `${y}px`,
        left: `${x}px`,
    };

    return (
        <div 
            ref={menuRef}
            style={style} 
            className="fixed bg-[#252526] border border-gray-600 rounded-md shadow-2xl p-1.5 z-50 min-w-[180px]"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing it
        >
            <ul>
                {items.map((item, index) => (
                    item.type === 'separator' ? (
                       <li key={`sep-${index}`} className="h-px bg-gray-600 my-1.5" />
                    ) : (
                        <li key={item.label}>
                            <button
                                onClick={() => handleItemClick(item)}
                                className="w-full text-left px-3 py-1.5 text-sm text-gray-200 rounded-sm hover:bg-blue-600 hover:text-white"
                            >
                                {item.label}
                            </button>
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
};
