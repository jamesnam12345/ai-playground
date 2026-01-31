'use client';

import { useChat } from '@ai-sdk/react';
import React from 'react';
import ReactMarkdown from 'react-markdown';


export default function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = React.useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const value = input;
    setInput('');
    await sendMessage({ text: value });
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto h-screen">
      <header className="p-4 border-b bg-white z-10 sticky top-0">
        <h1 className="text-xl font-bold text-center">System Design Architect</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`p-4 rounded-lg max-w-[85%] prose dark:prose-invert ${m.role === 'user'
                ? 'bg-blue-600 text-white prose-headings:text-white prose-p:text-white prose-strong:text-white prose-code:text-blue-100'
                : 'bg-gray-100 text-gray-900'
                }`}
            >
              <ReactMarkdown>
                {m.parts
                  ? m.parts
                    .filter(part => part.type === 'text')
                    .map(part => part.text)
                    .join('')
                  : ''}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p>Ready to design? Ask me a system design question.</p>
            <p className="text-sm">e.g., "Design a URL shortener" or "Trade-offs of SQL vs NoSQL"</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about system design..."
              disabled={status === 'submitted' || status === 'streaming'}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
              disabled={status === 'submitted' || status === 'streaming'}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
