export type OverlayPanelId = 'workspaces' | 'files' | 'extensions';
export type ActivePanelId = OverlayPanelId | 'ai';

export interface AITask {
  id: string;
  userPrompt: string;
  status: 'running' | 'completed' | 'error' | 'pending_confirmation';
  assistantResponse?: {
    content: string;
    operations: FileOperation[];
  };
  error?: string;
  timestamp: Date;
  type?: 'user' | 'autopilot';
}

export type FileOperationType = 'CREATE_FILE' | 'UPDATE_FILE' | 'DELETE_FILE' | 'CREATE_FOLDER' | 'DELETE_FOLDER' | 'RENAME_FILE' | 'RENAME_FOLDER';

export interface FileOperation {
  operation: FileOperationType;
  path: string;
  content?: string;
  newPath?: string;
}

export interface FileNode {
  type: 'file';
  content: string;
}

export interface FolderNode {
  type: 'folder';
  children: { [key: string]: FileNode | FolderNode };
}

export type FileSystemTree = FolderNode;

export type FileSystemNode = FileNode | FolderNode;

export interface LogMessage {
  level: 'log' | 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
}

export interface Workspace {
  id: string;
  name: string;
  fileSystem: FileSystemTree;
  tasks: AITask[];
  createdAt: string;
}

export interface WorkspaceUiState {
    activeOverlay: OverlayPanelId | null;
    activeEditorPath: string | null;
    isPreviewFullscreen: boolean;
    aiPrompt: string;
    previewTab: 'preview' | 'console';
    isAutoPilotOn: boolean;
}
