import React from 'react';
import type { LogMessage } from '../types';
import { RefactorIcon } from './icons/RefactorIcon';

interface AutoFixPromptProps {
    error: LogMessage;
    onFix: (error: LogMessage) => void;
}

export const AutoFixPrompt: React.FC<AutoFixPromptProps> = ({ error, onFix }) => {
    return (
        <div className="bg-gray-800 border border-red-500 rounded-lg p-4 m-2 flex items-center justify-between gap-4 animate-slide-in-left shadow-lg">
            <div className="min-w-0">
                <p className="font-semibold text-red-400">Application Error Detected</p>
                <p className="text-gray-400 text-sm mt-1">The AI can attempt to automatically fix this issue.</p>
            </div>
            <button
                onClick={() => onFix(error)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition-colors shrink-0 shadow-md"
            >
                <RefactorIcon className="w-5 h-5" />
                Fix
            </button>
        </div>
    );
};
