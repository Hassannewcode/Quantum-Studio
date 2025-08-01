import React, { useEffect, useState } from 'react';
import { XCircleIcon } from './icons/XCircleIcon';
import { CopyIcon } from './icons/CopyIcon';

interface CodePreviewModalProps {
    path: string;
    content: string;
    onClose: () => void;
}

export const CodePreviewModal: React.FC<CodePreviewModalProps> = ({ path, content, onClose }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
                className="relative flex flex-col bg-[#1E1E1E] border border-gray-700 rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[85vh] text-white"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-gray-700 shrink-0">
                    <h3 className="font-mono text-lg text-gray-300">{path}</h3>
                    <div className="flex items-center gap-4">
                         <button onClick={handleCopy} className="text-sm flex items-center gap-1.5 text-gray-400 hover:text-white">
                            <CopyIcon className="h-5 w-5" />
                            {copied ? 'Copied!' : 'Copy Code'}
                        </button>
                        <button onClick={onClose} aria-label="Close code preview">
                            <XCircleIcon className="h-7 w-7 text-gray-500 hover:text-white" />
                        </button>
                    </div>
                </header>
                <main className="p-4 overflow-auto flex-grow bg-gray-900/50">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                        <code>{content}</code>
                    </pre>
                </main>
            </div>
        </div>
    );
};
