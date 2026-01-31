import React from 'react';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { ChatSession } from './ChatLayout';

interface ChatSidebarProps {
    sessions: ChatSession[];
    activeSessionId: string;
    onSelectSession: (id: string) => void;
    onNewChat: () => void;
    onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
    sessions,
    activeSessionId,
    onSelectSession,
    onNewChat,
    onDeleteSession,
}) => {
    return (
        <div className="w-64 bg-gray-900 h-full flex flex-col border-r border-gray-800 text-gray-100 flex-shrink-0 transition-all duration-300">
            <div className="p-4">
                <button
                    onClick={onNewChat}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
                >
                    <Plus size={20} />
                    <span>New Chat</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-1">
                {sessions.length === 0 && (
                    <div className="text-gray-500 text-sm text-center mt-10 p-4">
                        No active chats. Start a new one!
                    </div>
                )}
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        onClick={() => onSelectSession(session.id)}
                        className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${activeSessionId === session.id
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                            }`}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <MessageSquare size={18} className="flex-shrink-0" />
                            <span className="truncate text-sm font-medium">
                                {session.title || 'New Conversation'}
                            </span>
                        </div>

                        <button
                            onClick={(e) => onDeleteSession(session.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-900/50 hover:text-red-400 rounded transition-all"
                            title="Delete chat"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-gray-800 text-xs text-center text-gray-600">
                built (strictly) for demo purpose by James Nam
            </div>
        </div>
    );
};
