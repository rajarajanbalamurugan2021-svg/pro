import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../../types';
import { callAIChatbot } from '../../services/api';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  Minus,
  Maximize2,
  Minimize2,
  MessageSquare,
  ChevronDown
} from 'lucide-react';

interface AIChatbotProps {
  currentUser: User;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  isError?: boolean;
}

const STORAGE_KEY = 'ckcet_campus_ai_chat_history';

export const AIChatbot: React.FC<AIChatbotProps> = ({
  currentUser,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  onOpen: externalOnOpen
}) => {
  // Internal open state or controlled externally
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
    return [
      {
        id: 'welcome-1',
        sender: 'ai',
        text: `Hello ${currentUser.name || 'there'}! 👋 I am Campus AI, your 24/7 intelligent assistant for CKCET CAMPRO. Ask me about SGPA/CGPA calculations, filing complaints, leave requests, lab attendance requirements (75% min), project innovation ideas, or placement prep!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Save conversation history to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }, [messages]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen, isMinimized]);

  const handleToggleOpen = () => {
    if (isOpen) {
      if (externalOnClose) externalOnClose();
      setInternalIsOpen(false);
    } else {
      if (externalOnOpen) externalOnOpen();
      setInternalIsOpen(true);
      setIsMinimized(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: prompt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const history = messages
        .filter((m) => !m.isError)
        .map((m) => ({
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
        text: response.reply || "I'm sorry, I couldn't process that request at the moment.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chatbot error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Unable to connect to Campus AI servers. Please check your internet connection and try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (loading || messages.length === 0) return;

    // Find the last user message
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.sender === 'user');
    if (lastUserIndex === -1) return;

    const actualUserIndex = messages.length - 1 - lastUserIndex;
    const lastUserMsg = messages[actualUserIndex];

    // Remove any trailing AI responses after that user message
    const truncated = messages.slice(0, actualUserIndex + 1);
    setMessages(truncated);
    setLoading(true);

    try {
      const history = truncated.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text
      }));

      const response = await callAIChatbot(history, {
        name: currentUser.name,
        role: currentUser.role,
        department: currentUser.department
      });

      const newAiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, newAiMsg]);
    } catch (err) {
      console.error('Regenerate error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all conversation history?')) {
      const initialWelcome: ChatMessage = {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: `Hello ${currentUser.name}! I am Campus AI. How can I help you with your campus activities today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initialWelcome]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedPrompts = [
    'How do I calculate target CGPA for next semester?',
    'What is the procedure for duty leave approval?',
    'Report Wi-Fi issue in CSE Lab 3',
    'Tips for campus placement interview prep'
  ];

  return (
    <>
      {/* Floating Bottom-Right Launcher Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={handleToggleOpen}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl flex items-center justify-center ring-4 ring-purple-500/20 group hover:shadow-purple-500/40 transition-all cursor-pointer"
            aria-label="Open Campus AI Assistant"
            title="Ask Campus AI"
          >
            <div className="relative">
              <Sparkles className="h-6 w-6 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Overlay / Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`fixed z-50 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-300 ${
              isMinimized
                ? 'bottom-6 right-6 w-80 h-14 rounded-2xl'
                : isMaximized
                ? 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[600px] h-[calc(100vh-5rem)] max-h-[750px] rounded-3xl'
                : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[550px] max-h-[85vh] rounded-3xl'
            }`}
          >
            {/* Header Bar */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shrink-0 select-none">
              <div
                onClick={() => isMinimized && setIsMinimized(false)}
                className="flex items-center gap-2.5 cursor-pointer flex-1"
              >
                <div className="relative p-1.5 rounded-xl bg-white/20 backdrop-blur-sm shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-purple-600"></span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-tight leading-none flex items-center gap-1.5">
                    Campus AI Assistant
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-medium">
                      Gemini 3.6
                    </span>
                  </h3>
                  <span className="text-[10px] text-blue-100 opacity-90 block mt-0.5">
                    {currentUser.name ? `Helping ${currentUser.name}` : '24/7 Smart Campus Copilot'}
                  </span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1 shrink-0">
                {!isMinimized && (
                  <>
                    <button
                      onClick={handleClearHistory}
                      className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
                      title="Clear chat history"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIsMaximized(!isMaximized)}
                      className="hidden sm:block p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
                      title={isMaximized ? 'Restore size' : 'Maximize window'}
                    >
                      {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </button>
                  </>
                )}

                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  <Minus className="h-4 w-4" />
                </button>

                <button
                  onClick={handleToggleOpen}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
                  title="Close AI Assistant"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Main Chat Body (Hidden if minimized) */}
            {!isMinimized && (
              <>
                {/* Scrollable Message List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/50 dark:bg-slate-900/50">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex items-start gap-2.5 ${
                        m.sender === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          m.sender === 'user'
                            ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                            : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                        }`}
                      >
                        {m.sender === 'user' ? (
                          <UserIcon className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>

                      {/* Message Content Bubble */}
                      <div className="group relative max-w-[82%] sm:max-w-[85%]">
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed transition-all shadow-sm ${
                            m.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                              : m.isError
                              ? 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 rounded-tl-none'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{m.text}</p>

                          <div
                            className={`flex items-center justify-between gap-2 mt-1.5 pt-1 border-t text-[10px] ${
                              m.sender === 'user'
                                ? 'border-white/10 text-blue-100'
                                : 'border-slate-100 dark:border-slate-700/50 text-slate-400'
                            }`}
                          >
                            <span>{m.time}</span>

                            {m.sender === 'ai' && !m.isError && (
                              <button
                                onClick={() => handleCopy(m.id, m.text)}
                                className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition"
                                title="Copy message"
                              >
                                {copiedId === m.id ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-500" />
                                    <span className="text-emerald-500 font-semibold">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {loading && (
                    <div className="flex items-start gap-2.5">
                      <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="p-3.5 rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-purple-600 animate-bounce"></span>
                          <span className="h-2 w-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]"></span>
                          <span className="h-2 w-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          Campus AI is typing...
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Regenerate Action Banner (If last message was AI) */}
                {messages.length > 1 &&
                  messages[messages.length - 1].sender === 'ai' &&
                  !loading && (
                    <div className="px-4 py-1.5 bg-slate-100/80 dark:bg-slate-800/50 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Need a different answer?</span>
                      <button
                        onClick={handleRegenerate}
                        className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Regenerate response</span>
                      </button>
                    </div>
                  )}

                {/* Suggested Prompt Pills */}
                <div className="px-3 py-2 bg-slate-100/50 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 overflow-x-auto scrollbar-none">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    {suggestedPrompts.map((promptText, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(promptText)}
                        disabled={loading}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition shadow-2xs shrink-0 disabled:opacity-50"
                      >
                        {promptText}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-end gap-2">
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-1.5 focus-within:border-purple-500 transition">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask Campus AI (e.g., duty leave rules)..."
                      rows={1}
                      className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 resize-none focus:outline-none px-2 py-1 max-h-24"
                    />
                  </div>

                  <button
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    className="h-9 w-9 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold hover:opacity-90 disabled:opacity-40 transition shadow-md shadow-purple-500/20 shrink-0 cursor-pointer"
                    title="Send message (Enter)"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
