import React from 'react';

interface SwitchProps {
  isOn: boolean;
  onToggle: () => void;
  label?: string;
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({ isOn, onToggle, label, id = 'toggle-switch' }) => {
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <div className="relative">
        <input id={id} type="checkbox" className="sr-only" checked={isOn} onChange={onToggle} />
        <div className={`block w-12 h-6 rounded-full transition-colors ${isOn ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isOn ? 'transform translate-x-6' : ''}`}></div>
      </div>
      {label && <div className="ml-3 text-gray-300 text-sm font-medium">{label}</div>}
    </label>
  );
};
