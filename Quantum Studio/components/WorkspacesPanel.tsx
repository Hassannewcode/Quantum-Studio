import React from 'react';
import type { Workspace } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface WorkspacesPanelProps {
    workspaces: Workspace[];
    activeWorkspaceId: string | null;
    onSwitchWorkspace: (id: string) => void;
    onCreateWorkspace: () => void;
    onDeleteWorkspace: (id: string) => void;
}

export const WorkspacesPanel: React.FC<WorkspacesPanelProps> = ({ 
    workspaces, 
    activeWorkspaceId, 
    onSwitchWorkspace, 
    onCreateWorkspace,
    onDeleteWorkspace
}) => {
    
    const sortedWorkspaces = [...workspaces].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return (
        <div className="bg-[#1E1E1E] flex flex-col h-full w-full text-white">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold">Workspaces</h2>
                <button 
                    onClick={onCreateWorkspace}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors text-sm font-semibold"
                    title="Create new workspace"
                >
                    <PlusIcon className="w-5 h-5"/>
                    New
                </button>
            </div>
            <div className="flex-grow overflow-y-auto">
                {sortedWorkspaces.length > 0 ? (
                    <ul className="p-2 space-y-1">
                        {sortedWorkspaces.map(ws => (
                            <li key={ws.id}>
                                <div className={`group flex items-center justify-between gap-2 p-2 rounded-md transition-colors ${activeWorkspaceId === ws.id ? 'bg-blue-600/30' : 'hover:bg-gray-700'}`}>
                                    <div className="flex-grow min-w-0 cursor-pointer" onClick={() => onSwitchWorkspace(ws.id)}>
                                        <p className={`font-medium truncate ${activeWorkspaceId === ws.id ? 'text-blue-300' : 'text-gray-200'}`}>{ws.name}</p>
                                        <p className="text-xs text-gray-400">
                                            Created: {new Date(ws.createdAt).toLocaleDateString()}
                                            <span className="mx-1">&middot;</span>
                                            {ws.tasks.length} tasks
                                        </p>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDeleteWorkspace(ws.id); }}
                                        className="p-1.5 rounded-md text-gray-500 hover:bg-red-900/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                        title="Delete workspace"
                                    >
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-4 text-center text-gray-500">
                        No workspaces found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
};
