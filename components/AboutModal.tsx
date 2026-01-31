import React from 'react';
import { X, ExternalLink, Activity, Shield, Cpu } from 'lucide-react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-800 transform transition-all scale-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Streaming AI chat demo
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Privacy First</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    No databases. No local storage. All chat history is kept in-memory and vanishes instantly when you refresh the page.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                                <Cpu size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">AI Architecture</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Powered by Google Gemini 2.5 Flash via the Vercel AI SDK.
                                    Streaming real-time responses at the Edge.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Tech Stack</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Built with Next.js 14, React 19, Tailwind CSS, and TypeScript by James Nam.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
