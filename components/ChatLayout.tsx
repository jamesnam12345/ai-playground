import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UIMessage } from 'ai';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';
import { AboutModal } from './AboutModal';
import { Menu, Info } from 'lucide-react';

export interface ChatSession {
    id: string;
    title: string;
    messages: UIMessage[];
}

export const ChatLayout: React.FC = () => {
    const [sessions, setSessions] = useState<ChatSession[]>([
        { id: uuidv4(), title: '', messages: [] }
    ]);
    const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0].id);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

    const createNewSession = () => {
        const newSession: ChatSession = {
            id: uuidv4(),
            title: '',
            messages: [],
        };
        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        // On mobile, maybe close sidebar
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const deleteSession = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSessions = sessions.filter(s => s.id !== id);
        if (newSessions.length === 0) {
            // Always keep one session
            createNewSession();
            const fresh = { id: uuidv4(), title: '', messages: [] };
            setSessions([fresh]);
            setActiveSessionId(fresh.id);
        } else {
            setSessions(newSessions);
            if (activeSessionId === id) {
                setActiveSessionId(newSessions[0].id);
            }
        }
    };

    const updateSessionMessages = (id: string, messages: UIMessage[]) => {
        setSessions((prev) =>
            prev.map((s) => (s.id === id ? { ...s, messages } : s))
        );
    };

    const updateSessionTitle = (id: string, title: string) => {
        setSessions((prev) =>
            prev.map((s) => (s.id === id ? { ...s, title } : s))
        );
    };

    return (
        <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 md:relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:w-0 md:translate-x-0 md:overflow-hidden'}`}>
                <ChatSidebar
                    sessions={sessions}
                    activeSessionId={activeSessionId}
                    onSelectSession={(id) => {
                        setActiveSessionId(id);
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    onNewChat={createNewSession}
                    onDeleteSession={deleteSession}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full w-full relative">
                {/* Header */}
                <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                            {activeSession.title || 'New Chat'}
                        </h1>
                    </div>

                    <button
                        onClick={() => setIsAboutOpen(true)}
                        className="p-2 -mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        title="About this demo"
                    >
                        <Info size={20} />
                    </button>
                </header>

                {/* Chat Area */}
                <div className="flex-1 relative overflow-hidden">
                    {/* Key is crucial here to force re-mount when session ID changes, ensuring fresh useChat state */}
                    <ChatWindow
                        key={activeSession.id}
                        session={activeSession}
                        onUpdateMessages={updateSessionMessages}
                        onUpdateTitle={updateSessionTitle}
                    />
                </div>
            </div>

            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
        </div>
    );
};
