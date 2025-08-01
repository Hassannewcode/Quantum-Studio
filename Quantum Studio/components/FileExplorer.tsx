




import React, { useState, useRef } from 'react';
import type { FileSystemTree, FileSystemNode, FileOperation } from '../types';
import { FolderIcon } from './icons/FolderIcon';
import { FileIcon } from './icons/FileIcon';
import type { ContextMenuItem } from './ContextMenu';
import { NewFileIcon } from './icons/NewFileIcon';
import { NewFolderIcon } from './icons/NewFolderIcon';
import { UploadIcon } from './icons/UploadIcon';

interface FileExplorerProps {
  fileSystem: FileSystemTree;
  setContextMenu: (menu: { x: number, y: number, items: ContextMenuItem[] } | null) => void;
  onAiTaskRequest: (prompt: string) => void;
  onFileSelect: (path: string) => void;
  activeFilePath: string | null;
  onFileUpload: (files: FileList) => void;
  onDirectFileOps: (ops: FileOperation[]) => void;
  onNewFileRequest: (basePath?: string) => void;
  onNewFolderRequest: (basePath?: string) => void;
}

const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) {
        return <FileIcon className="text-cyan-400 h-4 w-4 shrink-0" />;
    }
    if (fileName.endsWith('.js') || fileName.endsWith('.ts')) {
        return <FileIcon className="text-yellow-400 h-4 w-4 shrink-0" />;
    }
    if (fileName.endsWith('.json')) {
        return <FileIcon className="text-orange-400 h-4 w-4 shrink-0" />;
    }
    if (fileName.endsWith('.css') || fileName.endsWith('.scss')) {
        return <FileIcon className="text-blue-400 h-4 w-4 shrink-0" />;
    }
    return <FileIcon className="text-gray-400 h-4 w-4 shrink-0" />;
};

const TreeNode: React.FC<{ 
    name: string; 
    node: FileSystemNode; 
    path: string; 
    setContextMenu: FileExplorerProps['setContextMenu'];
    onAiTaskRequest: FileExplorerProps['onAiTaskRequest'];
    onFileSelect: FileExplorerProps['onFileSelect'];
    activeFilePath: FileExplorerProps['activeFilePath'];
    onDirectFileOps: FileExplorerProps['onDirectFileOps'];
    onNewFileRequest: FileExplorerProps['onNewFileRequest'];
    onNewFolderRequest: FileExplorerProps['onNewFolderRequest'];
}> = ({ name, node, path, setContextMenu, onAiTaskRequest, onFileSelect, activeFilePath, onDirectFileOps, onNewFileRequest, onNewFolderRequest }) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        let items: ContextMenuItem[] = [];
        if (node.type === 'file') {
            items = [
                { 
                    label: 'Rename', 
                    action: () => {
                        const newName = prompt(`Enter new name for "${name}":`, name);
                        if (newName && newName.trim() && newName !== name) {
                            const newPath = path.substring(0, path.lastIndexOf('/') + 1) + newName;
                            onDirectFileOps([{ operation: 'RENAME_FILE', path, newPath }]);
                        }
                    } 
                },
                { 
                    label: 'Delete File', 
                    action: () => {
                        if (confirm(`Are you sure you want to delete "${path}"?`)) {
                           onDirectFileOps([{ operation: 'DELETE_FILE', path }]);
                        }
                    }
                }
            ];
        } else { // folder
             items = [
                { 
                    label: 'New File', 
                    action: () => onNewFileRequest(path)
                },
                { 
                    label: 'New Folder', 
                    action: () => onNewFolderRequest(path)
                },
                { type: 'separator' },
                { 
                    label: 'Rename Folder', 
                    action: () => {
                        const newName = prompt(`Enter new name for "${name}":`, name);
                        if (newName && newName.trim() && newName !== name) {
                            const newPath = path.substring(0, path.lastIndexOf('/') + 1) + newName;
                            onDirectFileOps([{ operation: 'RENAME_FOLDER', path, newPath }]);
                        }
                    } 
                },
                { 
                    label: 'Delete Folder', 
                    action: () => {
                        if (confirm(`Are you sure you want to delete the folder "${path}" and all its contents?`)) {
                            onDirectFileOps([{ operation: 'DELETE_FOLDER', path }]);
                        }
                    }
                }
            ];
        }
        setContextMenu({ x: e.clientX, y: e.clientY, items });
    };

    if (node.type === 'folder') {
        return (
            <div onContextMenu={handleContextMenu}>
                <button 
                    className="w-full flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-700 cursor-pointer text-left"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <FolderIcon isOpen={isOpen} className="h-5 w-5 text-yellow-500 shrink-0" />
                    <span className="font-medium text-gray-200 truncate">{name}</span>
                </button>
                {isOpen && (
                    <div className="pl-4 border-l border-gray-700 ml-2.5">
                        {Object.entries(node.children)
                            .sort(([aName, aNode], [bName, bNode]) => {
                                if (aNode.type !== bNode.type) return aNode.type === 'folder' ? -1 : 1;
                                return aName.localeCompare(bName);
                            })
                            .map(([childName, childNode]) => (
                                <TreeNode 
                                    key={childName} 
                                    name={childName} 
                                    node={childNode} 
                                    path={`${path}/${childName}`}
                                    setContextMenu={setContextMenu}
                                    onAiTaskRequest={onAiTaskRequest} 
                                    onFileSelect={onFileSelect}
                                    activeFilePath={activeFilePath}
                                    onDirectFileOps={onDirectFileOps}
                                    onNewFileRequest={onNewFileRequest}
                                    onNewFolderRequest={onNewFolderRequest}
                                />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const isActive = activeFilePath === path;

    // It's a file
    return (
        <button 
            className={`w-full flex items-center gap-2 p-1.5 rounded-md text-left ${isActive ? 'bg-blue-600/30' : 'hover:bg-gray-700'}`} 
            onContextMenu={handleContextMenu}
            onClick={() => onFileSelect(path)}
        >
            {getFileIcon(name)}
            <span className={`truncate ${isActive ? 'text-blue-300' : 'text-gray-300'}`}>{name}</span>
        </button>
    );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
  fileSystem, 
  setContextMenu, 
  onAiTaskRequest, 
  onFileSelect, 
  activeFilePath, 
  onFileUpload, 
  onDirectFileOps,
  onNewFileRequest,
  onNewFolderRequest
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload(e.target.files);
      e.target.value = '';
    }
  };
  
  return (
    <div className="bg-[#1E1E1E] flex flex-col h-full w-full">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-200">File Explorer</h2>
        <div className="flex items-center gap-1">
            <button onClick={() => onNewFileRequest()} title="New File" className="p-1.5 rounded text-gray-300 hover:bg-gray-600">
                <NewFileIcon className="w-5 h-5" />
            </button>
            <button onClick={() => onNewFolderRequest()} title="New Folder" className="p-1.5 rounded text-gray-300 hover:bg-gray-600">
                <NewFolderIcon className="w-5 h-5" />
            </button>
            <button onClick={handleUploadClick} title="Upload Files" className="p-1.5 rounded text-gray-300 hover:bg-gray-600">
                <UploadIcon className="w-5 h-5" />
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                className="hidden"
                aria-hidden="true"
            />
        </div>
      </div>
      <div className="flex-grow p-2 overflow-y-auto space-y-0.5">
        {Object.entries(fileSystem.children)
          .sort(([aName, aNode], [bName, bNode]) => {
                if (aNode.type !== bNode.type) return aNode.type === 'folder' ? -1 : 1;
                return aName.localeCompare(bName);
            })
          .map(([name, node]) => (
            <TreeNode 
              key={name} 
              name={name} 
              node={node} 
              path={name} 
              setContextMenu={setContextMenu} 
              onAiTaskRequest={onAiTaskRequest}
              onFileSelect={onFileSelect}
              activeFilePath={activeFilePath}
              onDirectFileOps={onDirectFileOps}
              onNewFileRequest={onNewFileRequest}
              onNewFolderRequest={onNewFolderRequest}
            />
        ))}
      </div>
    </div>
  );
};