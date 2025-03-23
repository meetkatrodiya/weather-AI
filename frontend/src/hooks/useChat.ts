import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Parse and add assistant message
        const text = new TextDecoder().decode(value);
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: text
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
    }
  };

  return { messages, input, handleInputChange, handleSubmit };
} 