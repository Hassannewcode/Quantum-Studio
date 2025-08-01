import React, { useEffect, useRef } from 'react';

interface OverlayPanelProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    side?: 'left';
}

export const OverlayPanel: React.FC<OverlayPanelProps> = ({ isOpen, onClose, children }) => {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black bg-opacity-60 z-30" 
                onClick={onClose}
                aria-hidden="true"
            ></div>
            <div
                ref={panelRef}
                className="fixed top-0 left-[56px] h-full w-80 bg-[#1E1E1E] border-r border-gray-700 z-40 animate-slide-in-left shadow-2xl"
                role="dialog"
                aria-modal="true"
            >
                {children}
            </div>
        </>
    );
};
