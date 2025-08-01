import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ConsoleMessage } from './ConsoleMessage';
import { AutoFixPrompt } from './AutoFixPrompt';
import type { LogMessage } from '../types';
import { EyeIcon } from './icons/EyeIcon';
import { TerminalIcon } from './icons/TerminalIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { FullscreenIcon } from './icons/FullscreenIcon';
import { ExitFullscreenIcon } from './icons/ExitFullscreenIcon';


interface WebsitePreviewProps {
    code: string;
    fixableError: LogMessage | null;
    onConsoleLog: (log: LogMessage) => void;
    onAutoFix: (log: LogMessage) => void;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
    activeTab: 'preview' | 'console';
    onTabChange: (tab: 'preview' | 'console') => void;
}

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({ code, fixableError, onConsoleLog, onAutoFix, isFullscreen, onToggleFullscreen, activeTab, onTabChange }) => {
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const consoleScript = `
        const originalConsole = { ...window.console };
        const serialize = (arg) => {
            if (arg instanceof Error) {
                return \`Error: \${arg.message}\\n\${arg.stack}\`;
            }
            if (typeof arg === 'function') {
                return \`[Function: \${arg.name || 'anonymous'}]\`;
            }
            if (typeof arg === 'undefined') return 'undefined';
            if (arg === null) return 'null';
            if (typeof arg === 'object') {
                try {
                    const seen = new WeakSet();
                    return JSON.stringify(arg, (key, value) => {
                        if (typeof value === 'object' && value !== null) {
                            if (seen.has(value)) return '[Circular]';
                            seen.add(value);
                        }
                        return value;
                    }, 2);
                } catch (e) {
                    return '[Unserializable Object]';
                }
            }
            return String(arg);
        };

        Object.keys(originalConsole).forEach(level => {
            window.console[level] = (...args) => {
                window.parent.postMessage({
                    type: 'console',
                    level: level,
                    message: args.map(serialize).join(' '),
                }, '*');
                originalConsole[level].apply(window.console, args);
            };
        });

        window.addEventListener('error', (event) => {
             window.parent.postMessage({
                type: 'console',
                level: 'error',
                message: \`Uncaught Error: \${event.message} at \${event.filename}:\${event.lineno}\`,
            }, '*');
        });
        window.addEventListener('unhandledrejection', event => {
            window.parent.postMessage({
                type: 'console',
                level: 'error',
                message: \`Unhandled Promise Rejection: \${event.reason}\`,
            }, '*');
        });
    `;

    const srcDoc = useMemo(() => {
        const renderScript = `
            try {
                ${code}
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(React.createElement(App));
            } catch (err) {
                console.error(err);
                const errorContainer = document.createElement('div');
                errorContainer.style.backgroundColor = '#fff5f5';
                errorContainer.style.color = '#c53030';
                errorContainer.style.padding = '1rem';
                errorContainer.style.fontFamily = 'monospace';
                errorContainer.style.whiteSpace = 'pre-wrap';
                errorContainer.innerText = 'Render Error: ' + err.message + '\\n' + err.stack;
                document.getElementById('root').innerHTML = ''; // Clear previous content
                document.getElementById('root').appendChild(errorContainer);
            }
        `;
        
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <script src="https://cdn.tailwindcss.com"></script>
                <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                <style> body { background-color: #ffffff; color: #111827; padding: 0; margin: 0; } </style>
                <script>${consoleScript}</script>
            </head>
            <body>
                <div id="root"></div>
                <script type="text/babel" data-presets="react,typescript">${renderScript}</script>
            </body>
            </html>
        `;
    }, [code]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'console') {
                const { level, message } = event.data;
                const validLevels: LogMessage['level'][] = ['log', 'debug', 'info', 'warn', 'error'];
                const logLevel = validLevels.includes(level) ? level : 'log';
                
                const newLog = {
                    level: logLevel,
                    message,
                    timestamp: new Date()
                };
                setLogs(prevLogs => [...prevLogs, newLog]);
                onConsoleLog(newLog);

                if (logLevel === 'error') {
                    if (activeTab !== 'console') {
                        onTabChange('console');
                    }
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [activeTab, onConsoleLog, onTabChange]);

    useEffect(() => {
        setLogs([]);
    }, [code, refreshKey]);

    return (
        <div className="bg-[#1E1E1E] flex-grow flex flex-col h-full">
            <div className="p-2 border-b border-gray-700 text-sm text-gray-400 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onTabChange('preview')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md ${activeTab === 'preview' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                        <EyeIcon className="h-4 w-4"/>
                        <span>Live Preview</span>
                    </button>
                     <button
                        onClick={() => onTabChange('console')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md ${activeTab === 'console' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                        <TerminalIcon className="h-4 w-4"/>
                        <span>Console</span>
                        {logs.filter(l => l.level === 'error').length > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {logs.filter(l => l.level === 'error').length}
                            </span>
                        )}
                    </button>
                </div>
                 <div className="flex items-center gap-2">
                    <button onClick={handleRefresh} title="Refresh Preview" className="p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md">
                        <RefreshIcon className="h-5 w-5" />
                    </button>
                    <button onClick={onToggleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"} className="p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md">
                        {isFullscreen ? <ExitFullscreenIcon className="h-5 w-5" /> : <FullscreenIcon className="h-5 w-5" />}
                    </button>
                </div>
            </div>
            <div className="flex-grow bg-gray-900">
                {activeTab === 'preview' ? (
                    <iframe
                        key={refreshKey}
                        srcDoc={srcDoc}
                        title="Website Preview"
                        className="w-full h-full bg-white"
                        sandbox="allow-scripts allow-same-origin"
                    />
                ) : (
                    <div className="console-log">
                        {fixableError && (
                           <AutoFixPrompt error={fixableError} onFix={onAutoFix} />
                        )}
                        {logs.length > 0 ? (
                            logs.map((log, index) => <ConsoleMessage key={index} log={log} />)
                        ) : (
                            <div className="p-4 text-gray-500">Console is empty. Use console.log() in your code to see output here.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
