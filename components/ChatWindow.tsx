import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { UIMessage } from 'ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Send, StopCircle, User, Bot, Loader2 } from 'lucide-react';
import { ChatSession } from './ChatLayout';

interface ChatWindowProps {
    session: ChatSession;
    onUpdateMessages: (sessionId: string, messages: UIMessage[]) => void;
    onUpdateTitle: (sessionId: string, title: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    session,
    onUpdateMessages,
    onUpdateTitle,
}) => {
    const {
        messages,
        status,
        stop,
        setMessages,
        sendMessage,
    } = useChat({
        // api: '/api/chat', 
        onFinish: (message) => {
            // Sync happens in effect
        },
    });

    // Initialize messages
    useEffect(() => {
        setMessages(session.messages);
    }, []);

    const [input, setInput] = useState('');

    // Sync messages back to parent whenever they change
    useEffect(() => {
        if (messages !== session.messages) {
            onUpdateMessages(session.id, messages);

            // Auto-generate title from first user message if title is empty
            if (session.messages.length === 0 && messages.length > 0 && !session.title) {
                const firstUserMsg = messages.find(m => m.role === 'user');
                if (firstUserMsg) {
                    // Normalize content extraction
                    const content = (firstUserMsg as any).content ||
                        (firstUserMsg.parts?.filter(p => p.type === 'text').map(p => p.text).join('')) || '';

                    const newTitle = content.slice(0, 30) + (content.length > 30 ? '...' : '');
                    onUpdateTitle(session.id, newTitle);
                }
            }
        }
    }, [messages, session.id, onUpdateMessages, onUpdateTitle, session.messages, session.title]);

    const bottomRef = useRef<HTMLDivElement>(null);

    // Scroll only when new messages are added or user sends a message
    useEffect(() => {
        if (messages.length > 0 && (messages[messages.length - 1].role === 'user' || messages.length === 1)) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messages.length]); // Only trigger on length change, not every token update

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        const value = input;
        setInput('');
        await sendMessage({ text: value });
    };

    const isLoading = status === 'submitted' || status === 'streaming';

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-950 relative">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 min-h-0">
                <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 py-20">
                            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-full">
                                <Bot size={48} className="text-blue-500" />
                            </div>
                            <p className="text-lg font-medium">How can I help you today?</p>
                        </div>
                    )}

                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`flex gap-4 w-full group ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${m.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-emerald-600 text-white'
                                    }`}
                            >
                                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            <div
                                className={`flex-1 prose dark:prose-invert max-w-none p-4 rounded-2xl shadow-sm ${m.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-sm'
                                    : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-tl-sm'
                                    }`}
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                        pre: (props) => {
                                            const { node, ...rest } = props;
                                            return <div className="overflow-auto w-full my-2 bg-black/10 dark:bg-black/30 p-2 rounded-lg" {...(rest as any)} />;
                                        },
                                        code: (props) => {
                                            const { node, ...rest } = props;
                                            return <code className="bg-black/10 dark:bg-black/30 rounded px-1 py-0.5" {...(rest as any)} />;
                                        }
                                    }}
                                >
                                    {/* Handle parts gracefully if present, otherwise content string */}
                                    {(m as any).content || (m.parts?.filter(p => p.type === 'text').map(p => p.text).join('')) || ''}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4 w-full animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot size={16} className="text-white" />
                            </div>
                            <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl rounded-tl-sm flex items-center gap-2 text-gray-400">
                                <Loader2 size={16} className="animate-spin" />
                                <span className="text-sm">Generating response...</span>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} className="h-px w-full" />
                </div>
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4">
                <div className="max-w-3xl mx-auto relative">
                    <form onSubmit={handleSubmit} className="relative flex items-end gap-2 p-2 bg-gray-100 dark:bg-gray-900 rounded-xl border border-transparent focus-within:border-blue-500 transition-all shadow-inner">
                        <textarea
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e as any);
                                }
                            }}
                            placeholder="Send a message..."
                            className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-48 py-3 px-2 text-gray-900 dark:text-gray-100 placeholder-gray-500"
                            rows={1}
                            style={{ minHeight: '44px' }}
                        />

                        <div className="flex pb-2 pr-1">
                            {isLoading ? (
                                <button
                                    type="button"
                                    onClick={() => stop()}
                                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                >
                                    <StopCircle size={20} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={20} />
                                </button>
                            )}
                        </div>
                    </form>
                    <div className="text-center mt-2 text-xs text-gray-400">
                        AI can make mistakes, including about people, so double-check it. Built for demo purpose, by James N.
                    </div>
                </div>
            </div>
        </div>
    );
};
