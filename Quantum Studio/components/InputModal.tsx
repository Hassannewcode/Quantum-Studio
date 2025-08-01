import React, { useState, useEffect, useRef } from 'react';

interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (value: string) => void;
    title: string;
    label: string;
    initialValue?: string;
    confirmText?: string;
}

export const InputModal: React.FC<InputModalProps> = ({ isOpen, onClose, onConfirm, title, label, initialValue = '', confirmText = 'Create' }) => {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setValue(initialValue);
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 100);
        }
    }, [isOpen, initialValue]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);


    const handleSubmit = () => {
        onConfirm(value);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="relative flex flex-col bg-[#1E1E1E] border border-gray-700 rounded-lg shadow-2xl w-full max-w-lg text-white p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <label htmlFor="input-modal-field" className="text-sm text-gray-400 mb-2">{label}</label>
                <input
                    ref={inputRef}
                    id="input-modal-field"
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-gray-600 hover:bg-gray-500 text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-blue-600 hover:bg-blue-500 text-white"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
