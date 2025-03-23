import { useChat } from 'ai/react';
import { Message } from 'ai';
import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const MessageComponent = ({ message }: { message: Message }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-3xl rounded-lg p-4 ${
      message.role === 'user' 
        ? 'bg-blue-500 text-white ml-auto' 
        : 'bg-gray-100 text-black mr-auto'
    }`}>
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  </div>
);

export default function ChatInterface() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: 'http://localhost:3000/api/chat',
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-white text-white">
      <div className="flex-1 overflow-hidden">
        <div 
          ref={chatContainerRef}
          className="h-full overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message: Message) => (
            <MessageComponent key={message.id} message={message} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white text-white">
        <div className="flex space-x-4">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="input flex-1"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 