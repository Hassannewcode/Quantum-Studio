import React from 'react';
import type { ActivePanelId, OverlayPanelId } from '../types';

interface SidebarItem {
    panelId: ActivePanelId;
    label: string;
    icon: React.ReactElement;
}

interface SidebarProps {
    activePanel: OverlayPanelId | null;
    onPanelChange: (panel: ActivePanelId) => void;
    items: SidebarItem[];
}

interface SidebarButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ label, isActive, onClick, children }) => (
    <button
        onClick={onClick}
        aria-label={label}
        title={label}
        className={`w-14 h-14 flex items-center justify-center transition-colors duration-200 relative ${isActive ? 'text-blue-400 bg-gray-700' : 'text-gray-400 hover:bg-gray-600'
            }`}
    >
        {children}
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400"></div>}
    </button>
);


export const Sidebar: React.FC<SidebarProps> = ({ activePanel, onPanelChange, items }) => {
    return (
        <div className="bg-[#252526] border-r border-gray-700 flex flex-col items-center py-2 space-y-2 shrink-0 z-50">
            {items.map((item) => (
                <SidebarButton
                    key={item.panelId}
                    label={item.label}
                    isActive={activePanel === item.panelId || (item.panelId === 'ai' && activePanel === null)}
                    onClick={() => onPanelChange(item.panelId)}
                >
                    {item.icon}
                </SidebarButton>
            ))}
        </div>
    );
};
