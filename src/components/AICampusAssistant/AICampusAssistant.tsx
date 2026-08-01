import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../types';
import { Sparkles, X, Send, Bot, User as UserIcon, RefreshCw } from 'lucide-react';
import { callAIChatbot } from '../../services/api';

interface AICampusAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AICampusAssistant: React.FC<AICampusAssistantProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${currentUser.name}! I am your Smart Campus AI Assistant. Ask me about SGPA/CGPA calculations, filing grievances, lab attendance rules (75% minimum), or campus events.`,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: prompt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    const history = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      content: m.text
    }));
    history.push({ role: 'user', content: prompt });

    const response = await callAIChatbot(history, {
      name: currentUser.name,
      role: currentUser.role,
      department: currentUser.department
    });

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: response.reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  const suggestedPrompts = [
    'How do I calculate my target CGPA for Semester 7?',
    'What is the procedure for duty leave approval?',
    'Report Wi-Fi disconnection in CSE Lab 3',
    'Where is the Lost & Found collection center?'
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-all">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Smart Campus AI Bot</h3>
            <span className="text-[10px] text-blue-100">Powered by Gemini 3.6 API</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-purple-600 text-white'
              }`}
            >
              {m.sender === 'user' ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
              <span className="text-[9px] opacity-70 block text-right mt-1">{m.time}</span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
            <Bot className="h-4 w-4 animate-spin text-purple-600" />
            <span>Campus AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="p-2 px-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-1.5 overflow-x-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Suggested Prompts</span>
        <div className="flex flex-col gap-1">
          {suggestedPrompts.slice(0, 2).map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-left text-[11px] p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-500 transition truncate"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask AI anything about campus..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="p-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 disabled:opacity-50 transition"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};
