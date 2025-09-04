import React, { useEffect, useRef, useState } from 'react';
import { sendChat } from '../services/api';
import { useChat } from '../store/useChat';
import ChatBubble from '../components/ChatBubble';

function Chat() {
  const { messages, setMessages, addMessage } = useChat();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  // TODO: load history when backend route implemented
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    addMessage(userMsg);
    setInput('');
    setLoading(true);
    try {
      const data = await sendChat(input);
      addMessage({ role: 'assistant', text: data.assistantText, emotion: data.emotion });
    } catch (err) {
      addMessage({ role: 'assistant', text: err.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((m, idx) => (
          <ChatBubble key={idx} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-700 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-l-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 px-3 py-2 focus:outline-none"
          placeholder="Type your message..."
        />
        <button disabled={loading} className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-indigo-600 disabled:opacity-50">Send</button>
      </form>
    </div>
  );
}

export default Chat;