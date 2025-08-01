import React, { useRef, useEffect } from 'react';
import type { AITask } from '../types';
import { AITaskItem } from './AITaskItem';
import { Switch } from './Switch';

interface AIPanelProps {
    tasks: AITask[];
    onSendMessage: (prompt: string) => void;
    isLoading: boolean; // General loading state for the input
    setCodePreview: (preview: { path: string; content: string }) => void;
    prompt: string;
    onPromptChange: (newPrompt: string) => void;
    onApproveTask: (taskId: string) => void;
    onRejectTask: (taskId: string) => void;
    isAutoPilotOn: boolean;
    onToggleAutoPilot: () => void;
}

export const AIPanel: React.FC<AIPanelProps> = ({
    tasks,
    onSendMessage,
    isLoading,
    setCodePreview,
    prompt,
    onPromptChange,
    onApproveTask,
    onRejectTask,
    isAutoPilotOn,
    onToggleAutoPilot,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to top when a new task is added
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [tasks.length]);
    
    const handleSend = () => {
        if (prompt.trim()) {
            onSendMessage(prompt);
        }
    };

    const handlePromptKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="bg-[#1E1E1E] flex flex-col h-full">
            <div className="p-4 border-b border-gray-700">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-200">AI Assistant</h2>
                     <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase ${isAutoPilotOn ? 'text-blue-400' : 'text-gray-500'}`}>Auto-Pilot</span>
                        <Switch isOn={isAutoPilotOn} onToggle={onToggleAutoPilot} id="autopilot-switch" />
                    </div>
                </div>
                <p className="text-sm text-gray-400 mt-1">The AI can work proactively or on-demand.</p>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                 <div ref={messagesEndRef} />
                {tasks.length === 0 && (
                    <div className="text-center text-gray-500 pt-16">
                        <p>No tasks yet.</p>
                        <p>Ask the AI to build, test, or explain something.</p>
                    </div>
                )}
                {tasks.map(task => (
                    <AITaskItem 
                        key={task.id} 
                        task={task} 
                        setCodePreview={setCodePreview}
                        onApprove={onApproveTask}
                        onReject={onRejectTask}
                    />
                ))}
            </div>
            <div className="p-4 border-t border-gray-700 bg-[#181818]">
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => onPromptChange(e.target.value)}
                        onKeyDown={handlePromptKeyDown}
                        placeholder={isAutoPilotOn ? "Auto-Pilot is active. Turn it off to send a message." : "Ask the AI to build or change something..."}
                        aria-label="Chat prompt"
                        rows={3}
                        className="w-full p-2 pr-24 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-white"
                        disabled={isLoading || isAutoPilotOn}
                    />
                     <button
                        onClick={handleSend}
                        disabled={!prompt.trim() || isLoading || isAutoPilotOn}
                        className="absolute bottom-2.5 right-2.5 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        aria-label="Send message"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};
