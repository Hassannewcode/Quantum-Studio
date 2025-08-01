import React, { useState, useEffect, useMemo } from 'react';
import { LoaderIcon } from './icons/LoaderIcon';

interface Extension {
    name: string;
    publisher: string;
    description: string;
    installs: string;
}

interface ExtensionItemProps {
    extension: Extension;
    onStatusChange: () => void;
}

const ExtensionItem: React.FC<ExtensionItemProps> = ({ extension, onStatusChange }) => {
    const storageKey = `ext_${extension.name}`;
    const [isInstalled, setIsInstalled] = useState(() => localStorage.getItem(storageKey) === 'true');
    const [isChanging, setIsChanging] = useState(false);
    
    const handleInstall = () => {
        setIsChanging(true);
        setTimeout(() => {
            localStorage.setItem(storageKey, 'true');
            setIsInstalled(true);
            setIsChanging(false);
            onStatusChange();
        }, 1000);
    };

    const handleUninstall = () => {
        setIsChanging(true);
        setTimeout(() => {
            localStorage.removeItem(storageKey);
            setIsInstalled(false);
            setIsChanging(false);
            onStatusChange();
        }, 1000);
    }

    const description = extension.description.length > 60 
        ? extension.description.substring(0, 60) + '...' 
        : extension.description;

    return (
        <div className="p-4 border-b border-gray-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-600 rounded-md flex items-center justify-center text-xl font-bold shrink-0">
                {extension.name.charAt(0)}
            </div>
            <div className="flex-grow min-w-0">
                <h3 className="font-bold text-gray-100 truncate">{extension.name}</h3>
                <p className="text-sm text-gray-400">{description}</p>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-4">
                    <span className="truncate">{extension.publisher}</span>
                    <span>{extension.installs} Installs</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {isInstalled ? (
                    <button 
                        onClick={handleUninstall}
                        disabled={isChanging}
                        className="px-4 py-1.5 text-sm font-semibold rounded-md transition-colors w-28 text-center shrink-0 disabled:cursor-not-allowed bg-gray-600 hover:bg-red-700 text-white"
                    >
                        {isChanging ? '...' : 'Uninstall'}
                    </button>
                ) : (
                    <button 
                        onClick={handleInstall}
                        disabled={isChanging}
                        className="px-4 py-1.5 text-sm font-semibold rounded-md transition-colors w-28 text-center shrink-0 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 text-white"
                    >
                        {isChanging ? 'Installing...' : 'Install'}
                    </button>
                )}
            </div>
        </div>
    );
}

interface ExtensionsPanelProps {
    onExtensionChange: () => void;
}


export const ExtensionsPanel: React.FC<ExtensionsPanelProps> = ({ onExtensionChange }) => {
    const [allExtensions, setAllExtensions] = useState<Extension[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('./marketplace.json')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => setAllExtensions(data.extensions))
            .catch(e => {
                console.error("Failed to load extensions:", e);
                setError("Failed to load extensions marketplace.");
            })
            .finally(() => setLoading(false));
    }, []);
    
    const filteredExtensions = useMemo(() => {
        if (!searchTerm) return allExtensions;
        return allExtensions.filter(ext =>
            ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ext.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ext.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, allExtensions]);

    return (
        <div className="bg-[#1E1E1E] flex flex-col h-full w-full">
            <div className="p-4 border-b border-gray-700 shrink-0">
                <h2 className="text-lg font-bold text-gray-200">Extensions Marketplace</h2>
                 <input
                    type="text"
                    placeholder="Search extensions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full mt-3 p-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
            </div>
            <div className="flex-grow overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <LoaderIcon className="h-8 w-8 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-full text-red-400 p-4 text-center">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div>
                        {filteredExtensions.length > 0 ? (
                           filteredExtensions.map((ext) => (
                                <ExtensionItem key={ext.name} extension={ext} onStatusChange={onExtensionChange} />
                            ))
                        ) : (
                            <div className="text-center p-8 text-gray-400">
                                No extensions found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};