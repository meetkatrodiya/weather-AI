import React from 'react';
import Message from './components/Message';
import useChat from './hooks/useChat';
import './App.css';

function App() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col h-screen max-w-6xl w-full mx-auto bg-black">
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>

      <div className="w-full p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg bg-transparent text-white outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 border text-white rounded-lg hover:bg-white/10"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App; 