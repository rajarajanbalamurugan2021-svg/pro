import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, FAQItem } from '../../types';
import { callAIChatbot } from '../../services/api';
import {
  subscribeToFAQs,
  useOnlineStatus
} from '../../services/faqService';
import {
  findBestFAQMatch,
  getFAQSearchSuggestions,
  FAQMatchResult
} from '../../utils/faqMatchingEngine';
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
  Globe,
  WifiOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Download,
  HelpCircle,
  Tag,
  ArrowRight,
  Zap,
  CheckCircle2
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
  isOfflineMatch?: boolean;
  confidence?: number;
  category?: string;
  relatedQuestions?: string[];
  suggestedFAQs?: FAQItem[];
  isError?: boolean;
}

const STORAGE_KEY = 'ckcet_campus_ai_chat_history';

const SUGGESTED_QUICK_PROMPTS = [
  'How do I register?',
  'How do I reset my password?',
  'How do I apply for leave?',
  'How can I check attendance?',
  'How do I upload documents?',
  'How do I register a complaint?',
  'How can I join a project team?',
  'How do I view semester results?',
  'How is CGPA calculated?',
  'How do I apply for internships?',
  'How can I view placement status?',
  'How do I contact admin?'
];

const CATEGORIES_LIST = [
  'All',
  'General',
  'Student Module',
  'Faculty Module',
  'Admin Module',
  'Leave Management',
  'Complaint Management',
  'Project Collaboration',
  'Placement Module',
  'AI Career Module'
];

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

  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const { isOnline, lastSynced } = useOnlineStatus();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Speech Recognition & TTS State
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [liveSuggestions, setLiveSuggestions] = useState<FAQItem[]>([]);

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
        text: `Hello ${currentUser.name || 'there'}! 👋 I am the CKCET CAMPRO Offline AI FAQ Assistant. Ask me anything about registration, attendance, semester results, leave requests, campus grievances, innovation projects, or placements. I work completely offline with zero latency!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOfflineMatch: true,
        confidence: 1.0,
        category: 'General'
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Subscribe to FAQs from local cache / Firestore
  useEffect(() => {
    const unsub = subscribeToFAQs((updatedFaqs) => {
      setFaqs(updatedFaqs);
    });
    return () => unsub();
  }, []);

  // Save conversation history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }, [messages]);

  // Update live auto-complete search suggestions as user types
  useEffect(() => {
    if (input.trim().length >= 2) {
      const suggestions = getFAQSearchSuggestions(input, faqs, 4);
      setLiveSuggestions(suggestions);
    } else {
      setLiveSuggestions([]);
    }
  }, [input, faqs]);

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

  // Voice Input Speech Recognition Setup
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSend(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Text To Speech
  const handleTextToSpeech = (msgId: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingMsgId === msgId) {
        window.speechSynthesis.cancel();
        setSpeakingMsgId(null);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);

      setSpeakingMsgId(msgId);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-To-Speech is not supported in this browser.');
    }
  };

  // Main Handle Send Query Logic
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
    setLiveSuggestions([]);
    setLoading(true);

    // STEP 1: Attempt Offline Local FAQ Match (< 1ms execution)
    const matchRes = findBestFAQMatch(
      prompt,
      faqs,
      selectedCategory === 'All' ? undefined : selectedCategory,
      0.32
    );

    // If high confidence match OR user is offline -> return local FAQ answer immediately!
    if (matchRes.topMatch || !isOnline) {
      setTimeout(() => {
        let responseText = '';
        let confidence = matchRes.confidence;
        let category = 'General';
        let relatedQuestions = matchRes.relatedQuestions;
        let suggestedFAQs = matchRes.suggestedFAQs;

        if (matchRes.topMatch) {
          responseText = matchRes.topMatch.answer;
          category = matchRes.topMatch.category;
        } else {
          responseText = "I couldn't find an exact answer in our offline database for that question, but here are related FAQs that might help:";
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: responseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOfflineMatch: true,
          confidence,
          category,
          relatedQuestions,
          suggestedFAQs: !matchRes.topMatch ? suggestedFAQs : undefined
        };

        setMessages((prev) => [...prev, aiMsg]);
        setLoading(false);
      }, 150); // simulate tiny sub-second feel
      return;
    }

    // STEP 2: Fallback to Gemini AI Server call if online and query is open-ended / not in FAQs
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
        text: response.reply || "I am running in local FAQ mode. Please check the pre-built questions.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOfflineMatch: false,
        confidence: 0.85,
        category: 'Online AI'
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chatbot error:', err);
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: "I am operating in offline FAQ mode. Please select from our pre-built categories or questions above.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOfflineMatch: true
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (loading || messages.length === 0) return;

    const lastUserIndex = [...messages].reverse().findIndex((m) => m.sender === 'user');
    if (lastUserIndex === -1) return;

    const actualUserIndex = messages.length - 1 - lastUserIndex;
    const lastUserMsg = messages[actualUserIndex];

    const truncated = messages.slice(0, actualUserIndex);
    setMessages(truncated);
    handleSend(lastUserMsg.text);
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
        text: `Hello ${currentUser.name}! I am Campus AI Offline FAQ Assistant. How can I help you today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOfflineMatch: true
      };
      setMessages([initialWelcome]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleExportChat = () => {
    const formattedText = messages
      .map((m) => `[${m.time}] ${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n\n');
    const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8' });
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = URL.createObjectURL(blob);
    downloadAnchor.download = `ckcet_campro_chat_history_${Date.now()}.txt`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
            aria-label="Open Offline AI FAQ Chatbot"
            title="Ask Offline AI FAQ Chatbot"
          >
            <div className="relative">
              <Sparkles className="h-6 w-6 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Container */}
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
                ? 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[620px] h-[calc(100vh-5rem)] max-h-[760px] rounded-3xl'
                : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[580px] max-h-[88vh] rounded-3xl'
            }`}
          >
            {/* Header Bar */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between shrink-0 select-none">
              <div
                onClick={() => isMinimized && setIsMinimized(false)}
                className="flex items-center gap-2.5 cursor-pointer flex-1"
              >
                <div className="relative p-1.5 rounded-xl bg-white/20 backdrop-blur-sm shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-purple-700 ${
                      isOnline ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  ></span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-tight leading-none flex items-center gap-1.5">
                    CKCET CAMPRO AI FAQ
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isOnline ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                      }`}
                    >
                      {isOnline ? <Globe className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
                      {isOnline ? 'Online (Synced)' : 'Offline Engine'}
                    </span>
                  </h3>
                  <span className="text-[10px] text-blue-100 opacity-90 block mt-0.5">
                    {faqs.length} Pre-loaded FAQs • Fast Local Search
                  </span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1 shrink-0">
                {!isMinimized && (
                  <>
                    <button
                      onClick={handleExportChat}
                      className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
                      title="Export conversation log"
                    >
                      <Download className="h-4 w-4" />
                    </button>
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

            {/* Category Filter Pills (When expanded) */}
            {!isMinimized && (
              <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
                <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
                  <Tag className="w-3 h-3" /> Category:
                </span>
                {CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded-lg font-medium transition shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Main Chat Body */}
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
                      <div className="group relative max-w-[85%] sm:max-w-[88%]">
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed transition-all shadow-sm ${
                            m.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                              : m.isError
                              ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 rounded-tl-none'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                          }`}
                        >
                          {/* Offline / Confidence Badge for AI Messages */}
                          {m.sender === 'ai' && (
                            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-700/50">
                              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Zap className="w-3 h-3 text-amber-500" />
                                {m.isOfflineMatch ? 'Offline Engine Match' : 'Online AI'}
                                {m.confidence && ` (${(m.confidence * 100).toFixed(0)}%)`}
                              </span>
                              {m.category && (
                                <span className="text-[10px] text-slate-400 font-medium">{m.category}</span>
                              )}
                            </div>
                          )}

                          <p className="whitespace-pre-wrap">{m.text}</p>

                          {/* Fallback Suggested FAQs if query wasn't exact */}
                          {m.suggestedFAQs && m.suggestedFAQs.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5">
                              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                Suggested Offline FAQs:
                              </p>
                              <div className="space-y-1">
                                {m.suggestedFAQs.map((sf) => (
                                  <button
                                    key={sf.id}
                                    onClick={() => handleSend(sf.question)}
                                    className="w-full text-left p-1.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[11px] font-medium transition flex items-center justify-between"
                                  >
                                    <span className="line-clamp-1">? {sf.question}</span>
                                    <ArrowRight className="w-3 h-3 shrink-0" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Clickable Related Questions */}
                          {m.relatedQuestions && m.relatedQuestions.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                Related Questions:
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {m.relatedQuestions.map((rq, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleSend(rq)}
                                    className="text-[10px] bg-slate-100 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md transition text-left"
                                  >
                                    + {rq}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Message Footer & Audio / Copy Actions */}
                          <div
                            className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t text-[10px] ${
                              m.sender === 'user'
                                ? 'border-white/10 text-blue-100'
                                : 'border-slate-100 dark:border-slate-700/50 text-slate-400'
                            }`}
                          >
                            <span>{m.time}</span>

                            {m.sender === 'ai' && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleTextToSpeech(m.id, m.text)}
                                  className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition"
                                  title="Read aloud"
                                >
                                  {speakingMsgId === m.id ? (
                                    <VolumeX className="h-3 w-3 text-rose-500" />
                                  ) : (
                                    <Volume2 className="h-3 w-3" />
                                  )}
                                </button>

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
                                    </>
                                  )}
                                </button>
                              </div>
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
                        <span className="text-[11px] text-slate-500 font-medium">
                          Searching Offline Knowledge Engine...
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Regenerate Action Banner */}
                {messages.length > 1 &&
                  messages[messages.length - 1].sender === 'ai' &&
                  !loading && (
                    <div className="px-4 py-1 bg-slate-100/80 dark:bg-slate-800/50 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Didn't find what you needed?</span>
                      <button
                        onClick={handleRegenerate}
                        className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Re-query engine</span>
                      </button>
                    </div>
                  )}

                {/* Live Search Auto-Complete Dropdown */}
                {liveSuggestions.length > 0 && (
                  <div className="px-3 py-2 bg-blue-50/90 dark:bg-blue-950/80 border-t border-blue-200 dark:border-blue-800 text-xs space-y-1 max-h-32 overflow-y-auto">
                    <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" /> Matching FAQs:
                    </p>
                    {liveSuggestions.map((sug) => (
                      <button
                        key={sug.id}
                        onClick={() => handleSend(sug.question)}
                        className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-blue-900 dark:text-blue-100 text-xs font-semibold flex items-center justify-between transition"
                      >
                        <span className="line-clamp-1">{sug.question}</span>
                        <span className="text-[10px] bg-blue-200/60 dark:bg-blue-900 px-1.5 py-0.5 rounded text-blue-800 dark:text-blue-200">
                          {sug.category}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Prompts Bar */}
                <div className="px-3 py-2 bg-slate-100/50 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 overflow-x-auto scrollbar-none">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    {SUGGESTED_QUICK_PROMPTS.map((promptText, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(promptText)}
                        disabled={loading}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition shadow-2xs shrink-0 disabled:opacity-50"
                      >
                        {promptText}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Bar with Voice Toggle */}
                <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-end gap-2">
                  <button
                    onClick={handleVoiceInput}
                    className={`h-9 w-9 rounded-2xl flex items-center justify-center transition shrink-0 ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                    title={isListening ? 'Listening... click to stop' : 'Voice input'}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>

                  <div className="flex-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-1.5 focus-within:border-blue-500 transition">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={isListening ? 'Listening...' : 'Type a question (e.g. How do I apply for leave?)...'}
                      rows={1}
                      className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 resize-none focus:outline-none px-2 py-1 max-h-24"
                    />
                  </div>

                  <button
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    className="h-9 w-9 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold hover:opacity-90 disabled:opacity-40 transition shadow-md shadow-blue-500/20 shrink-0 cursor-pointer"
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
