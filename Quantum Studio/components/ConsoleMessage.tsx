import React from 'react';
import type { LogMessage } from '../types';

interface ConsoleMessageProps {
  log: LogMessage;
}

const levelClasses = {
  log: '',
  info: 'console-msg-info',
  warn: 'console-msg-warn',
  error: 'console-msg-error',
  debug: 'text-gray-500',
};

export const ConsoleMessage: React.FC<ConsoleMessageProps> = ({ log }) => {
  const time = log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const baseClass = 'console-msg';
  const levelClass = levelClasses[log.level] || '';

  return (
    <div className={`${baseClass} ${levelClass}`}>
      <span className="text-gray-500 shrink-0">{time}</span>
      <pre className="flex-grow">{log.message}</pre>
    </div>
  );
};
