import React from 'react';
import { XCircleIcon } from './icons/XCircleIcon';

interface CodeEditorProps {
    path: string;
    content: string;
    onContentChange: (newContent: string) => void;
    onClose: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ path, content, onContentChange, onClose }) => {
    return (
        <div className="bg-[#1E1E1E] flex flex-col h-full">
            <header className="flex items-center justify-between p-2.5 border-b border-gray-700 bg-[#252526] shrink-0">
                <h3 className="font-mono text-sm text-gray-300 bg-gray-700 px-3 py-1 rounded-md">{path}</h3>
                <button onClick={onClose} aria-label="Close editor">
                    <XCircleIcon className="h-6 w-6 text-gray-500 hover:text-white transition-colors" />
                </button>
            </header>
            <main className="flex-grow overflow-hidden">
                <textarea
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    spellCheck="false"
                    className="w-full h-full bg-[#1E1E1E] text-gray-200 p-4 font-mono text-sm leading-relaxed resize-none border-none focus:outline-none focus:ring-0"
                />
            </main>
        </div>
    );
};
