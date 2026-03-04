import React, { useState, useRef, useEffect } from 'react';
import { Message, AnalysisResult } from '../types';
import { chatWithAI } from '../services/gemini';
import { Send, Bot, User, Loader2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  context: AnalysisResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatBot: React.FC<Props> = ({ context, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm your Sentiment Assistant. Ask me anything about the analysis or how to improve customer satisfaction." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAI([...messages, userMsg], context);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl border border-zinc-200 flex flex-col z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-bottom bg-zinc-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-emerald-400" />
              <span className="font-semibold">Sentiment Assistant</span>
            </div>
            <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none shadow-sm'
                }`}>
                  <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] uppercase font-bold">
                    {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <div className="prose prose-sm max-w-none prose-p:leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-zinc-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 size={20} className="animate-spin text-emerald-600" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 bg-zinc-100 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
