import React from 'react';
import type { FileOperation } from '../types';
import { LoaderIcon } from './icons/LoaderIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { EyeIcon } from './icons/EyeIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';

interface AIOperationPreviewProps {
    operations: FileOperation[];
    status: 'processing' | 'confirmed' | 'pending';
    onViewCode: (preview: { path: string; content: string }) => void;
    onApprove?: () => void;
    onReject?: () => void;
}

const getOperationText = (op: FileOperation) => {
    switch (op.operation) {
        case 'CREATE_FILE': return 'Create file:';
        case 'UPDATE_FILE': return 'Update file:';
        case 'DELETE_FILE': return 'Delete file:';
        case 'CREATE_FOLDER': return 'Create folder:';
        case 'DELETE_FOLDER': return 'Delete folder:';
        case 'RENAME_FILE': return 'Rename file:';
        case 'RENAME_FOLDER': return 'Rename folder:';
        default: return 'Operation:';
    }
}

const statusConfig = {
    pending: {
        icon: <QuestionMarkCircleIcon className="h-5 w-5 text-yellow-400" />,
        title: 'Pending Approval',
    },
    processing: {
        icon: <LoaderIcon className="h-5 w-5 animate-spin text-blue-400" />,
        title: 'Applying changes...',
    },
    confirmed: {
        icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />,
        title: 'Changes Applied',
    }
};

export const AIOperationPreview: React.FC<AIOperationPreviewProps> = ({ operations, status, onViewCode, onApprove, onReject }) => {
    const { icon, title } = statusConfig[status];

    return (
        <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-600">
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <h4 className="font-semibold text-sm text-gray-300">{title}</h4>
            </div>
            <ul className="space-y-1.5 text-sm">
                {operations.map((op, index) => (
                    <li key={`${op.path}-${index}`} className="flex items-center justify-between gap-2 text-gray-400">
                        <div className="flex items-center gap-2 min-w-0">
                           <span className="text-gray-500 shrink-0">{getOperationText(op)}</span>
                           {op.operation.startsWith('RENAME') ? (
                               <span className="font-mono truncate" title={`${op.path} → ${op.newPath}`}>{op.path} → {op.newPath}</span>
                           ) : (
                               <span className="font-mono truncate" title={op.path}>{op.path}</span>
                           )}
                        </div>
                        {(op.operation === 'CREATE_FILE' || op.operation === 'UPDATE_FILE') && op.content && status !== 'processing' && (
                             <button 
                                onClick={() => onViewCode({ path: op.path, content: op.content || '' })}
                                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 shrink-0"
                                aria-label={`View code for ${op.path}`}
                             >
                                <EyeIcon className="h-4 w-4" />
                                View
                             </button>
                        )}
                    </li>
                ))}
            </ul>
            {status === 'pending' && (
                <div className="flex items-center justify-end gap-3 mt-4">
                    <button 
                        onClick={onReject}
                        className="px-4 py-1.5 text-sm font-semibold rounded-md transition-colors bg-gray-600 hover:bg-gray-500 text-white"
                    >
                        Reject
                    </button>
                     <button 
                        onClick={onApprove}
                        className="px-4 py-1.5 text-sm font-semibold rounded-md transition-colors bg-green-600 hover:bg-green-500 text-white"
                    >
                        Approve
                    </button>
                </div>
            )}
        </div>
    );
};
