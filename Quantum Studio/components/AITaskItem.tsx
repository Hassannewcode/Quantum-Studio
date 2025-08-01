import React, { useState } from 'react';
import type { AITask } from '../types';
import { LoaderIcon } from './icons/LoaderIcon';
import { CopyIcon } from './icons/CopyIcon';
import { AIOperationPreview } from './AIOperationPreview';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { AIAssistantIcon } from './icons/AIAssistantIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { UserIcon } from './icons/UserIcon';


const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-900 rounded-md my-2 text-white">
            <div className="flex justify-between items-center px-4 py-1 bg-black/30 rounded-t-md">
                <span className="text-xs text-gray-400">{language || 'code'}</span>
                <button onClick={handleCopy} className="text-xs flex items-center gap-1.5 text-gray-400 hover:text-white">
                    <CopyIcon className="h-4 w-4" />
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono">
                <code>{code}</code>
            </pre>
        </div>
    );
};

const AssistantMessageContent: React.FC<{ content: string; }> = ({ content }) => {
    const parts = content.split(/(```[\s\S]*?```)/g).filter(Boolean);

    return (
        <div className="whitespace-pre-wrap font-sans leading-relaxed text-gray-300">
            {parts.map((part, index) => {
                const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
                if (match) {
                    const language = match[1] || '';
                    const code = match[2] || '';
                    return <CodeBlock key={index} language={language} code={code} />;
                }
                return <span key={index}>{part}</span>;
            })}
        </div>
    );
};

const TaskHeaderIcon: React.FC<{ type: AITask['type'] }> = ({ type }) => {
    if (type === 'autopilot') {
        return (
            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-indigo-600/50 flex items-center justify-center" title="Auto-Pilot Task">
                <BrainCircuitIcon className="w-5 h-5 text-indigo-300" />
            </div>
        );
    }
    return (
         <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-600 flex items-center justify-center" title="User Task">
            <UserIcon className="w-5 h-5 text-gray-300" />
        </div>
    );
}

const StatusIcon: React.FC<{ status: AITask['status'] }> = ({ status }) => {
    switch (status) {
        case 'running':
            return <LoaderIcon className="h-5 w-5 animate-spin text-blue-400" />;
        case 'completed':
            return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
        case 'error':
            return <XCircleIcon className="h-5 w-5 text-red-400" />;
        case 'pending_confirmation':
            return <QuestionMarkCircleIcon className="h-5 w-5 text-yellow-400" />;
        default:
            return null;
    }
};

interface AITaskItemProps {
    task: AITask;
    setCodePreview: (preview: { path: string; content: string }) => void;
    onApprove: (taskId: string) => void;
    onReject: (taskId: string) => void;
}

export const AITaskItem: React.FC<AITaskItemProps> = ({ task, setCodePreview, onApprove, onReject }) => {
    const [isOpen, setIsOpen] = useState(true);
    const time = task.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const getPreviewStatus = (): 'processing' | 'confirmed' | 'pending' => {
        if (task.status === 'running') return 'processing';
        if (task.status === 'pending_confirmation') return 'pending';
        return 'confirmed';
    }

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg transition-all duration-300">
            <header 
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-700/50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <TaskHeaderIcon type={task.type} />
                <div className="flex-grow min-w-0">
                     <p className="font-medium text-gray-200 truncate" title={task.userPrompt}>
                        {task.userPrompt}
                    </p>
                    {task.type === 'autopilot' && <span className="text-xs text-indigo-400 font-semibold">AUTO-PILOT</span>}
                </div>
                <StatusIcon status={task.status} />
                <span className="text-xs text-gray-500 shrink-0">{time}</span>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </header>
            
            {isOpen && (
                <div className="p-4 border-t border-gray-700/80">
                    <div className="flex flex-col gap-4">
                        {/* Assistant Response */}
                        {task.assistantResponse && (
                             <div className="flex items-start gap-3">
                                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-600 flex items-center justify-center">
                                    <AIAssistantIcon className="w-5 h-5 text-gray-300" />
                                </div>
                                <div className="flex-grow pt-1">
                                    <AssistantMessageContent content={task.assistantResponse.content} />
                                    {task.assistantResponse.operations && task.assistantResponse.operations.length > 0 && (
                                        <AIOperationPreview
                                            operations={task.assistantResponse.operations}
                                            status={getPreviewStatus()}
                                            onViewCode={setCodePreview}
                                            onApprove={() => onApprove(task.id)}
                                            onReject={() => onReject(task.id)}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {task.status === 'error' && (
                            <div className="bg-red-900/40 border border-red-500/50 p-3 rounded-md">
                                <p className="font-semibold text-red-400">An error occurred</p>
                                <p className="text-sm text-red-300 mt-1 font-mono">{task.error}</p>
                            </div>
                        )}
                        
                        {/* Empty state while running */}
                        {task.status === 'running' && !task.assistantResponse && (
                            <div className="text-center text-gray-400 py-4">
                                Waiting for AI response...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
