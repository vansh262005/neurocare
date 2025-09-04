import React from 'react';
import { motion } from 'framer-motion';

function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow ${isUser ? 'bg-primary text-white self-end' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 self-start'}`}
    >
      <p className="whitespace-pre-wrap text-sm">{message.text}</p>
      {message.emotion && (
        <p className="text-xs mt-1 italic opacity-70">{message.emotion}</p>
      )}
    </motion.div>
  );
}

export default ChatBubble;