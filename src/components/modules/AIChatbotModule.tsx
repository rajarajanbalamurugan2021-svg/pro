import React, { useState, useEffect, useRef } from 'react';
import { User, FAQItem } from '../../types';
import { callAIChatbot } from '../../services/api';
import { subscribeToFAQs, useOnlineStatus } from '../../services/faqService';
import { findBestFAQMatch, getFAQSearchSuggestions } from '../../utils/faqMatchingEngine';
import {
  Bot,
  Sparkles,
  Send,
  User as UserIcon,
  Copy,
  Check,
  RotateCcw,
  Trash2,
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
  Search,
  BookOpen,
  MessageSquare,
  Award,
  FileText,
  AlertTriangle,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

interface Props {
  currentUser: User;
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
  'Placement Module'
];

export const AIChatbotModule: React.FC<Props> = ({ currentUser }) => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const { isOnline } = useOnlineStatus();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chat' | 'knowledge_base'>('chat');

  // Speech & Audio
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
        text: `Hello ${currentUser.name || 'there'}! 👋 Welcome to the CKCET CAMPRO AI Campus Assistant & FAQ Knowledge Engine. Ask me anything about registration, attendance, semester results, leave applications, campus grievances, innovation projects, or placement opportunities. I respond instantly with both local offline FAQs and online Gemini AI!`,
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

  // Subscribe to FAQs
  useEffect(() => {
    const unsub = subscribeToFAQs((updatedFaqs) => {
      setFaqs(updatedFaqs);
    });
    return () => unsub();
  }, []);

  // Save history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }, [messages]);

  // Live suggestions
  useEffect(() => {
    if (input.trim().length >= 2) {
      const suggestions = getFAQSearchSuggestions(input, faqs, 4);
      setLiveSuggestions(suggestions);
    } else {
      setLiveSuggestions([]);
    }
  }, [input, faqs]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Speech Recognition
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

    // STEP 1: Fast Offline Local FAQ Match
    const matchRes = findBestFAQMatch(
      prompt,
      faqs,
      selectedCategory === 'All' ? undefined : selectedCategory,
      0.32
    );

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
          responseText = "I couldn't find an exact match in our offline database, but here are related FAQs that may answer your query:";
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
      }, 150);
      return;
    }

    // STEP 2: Gemini API Call
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
        text: response.reply || "I am running in local FAQ mode. Please check pre-built questions.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOfflineMatch: false,
        confidence: 0.9,
        category: 'Gemini AI'
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chatbot error:', err);
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: "I am operating in offline FAQ mode. Please select from our pre-built categories or questions.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOfflineMatch: true
      };
      setMessages((prev) => [...prev, fallbackMsg]);
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
    if (window.confirm('Clear all chat conversation history?')) {
      const initialWelcome: ChatMessage = {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: `Hello ${currentUser.name}! I am Campus AI Assistant. How can I help you today?`,
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
    downloadAnchor.download = `ckcet_ai_chat_${Date.now()}.txt`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !faqSearchQuery.trim() ||
      item.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(faqSearchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-blue-100 border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Smart Campus AI Assistant & Knowledge Base</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Campus Assistant & FAQ Engine
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Ask questions about academic schedules, results, leave policies, complaint status, placement readiness, or project collaboration.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
              <span className="text-xs text-blue-100 block">Offline Knowledge Base</span>
              <span className="text-lg font-black text-white">{faqs.length} FAQs Loaded</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
              <span className="text-xs text-blue-100 block">Status</span>
              <span className="text-sm font-bold text-emerald-300 flex items-center justify-center gap-1">
                {isOnline ? <Globe className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                {isOnline ? 'Online Synced' : 'Offline Engine'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-white/15 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-blue-900 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Interactive AI Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('knowledge_base')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'knowledge_base'
                ? 'bg-white text-blue-900 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Campus FAQ Library</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'chat' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Chat Interface (3 cols) */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[680px]">
            
            {/* Header Controls */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Campus AI Co-Pilot
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                      Gemini 3.6 + Local Engine
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Ask any academic or operational question</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportChat}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Export chat history"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClearHistory}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="Clear history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
              <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Filter:
              </span>
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Chat History List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40 dark:bg-slate-900/40 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${
                    m.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                        : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                    }`}
                  >
                    {m.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="max-w-[82%]">
                    <div
                      className={`p-4 rounded-3xl text-xs leading-relaxed shadow-xs ${
                        m.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                          : m.isError
                          ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 rounded-tl-none'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                      }`}
                    >
                      {m.sender === 'ai' && (
                        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-700/60">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500" />
                            {m.isOfflineMatch ? 'Offline Engine Match' : 'Gemini AI'}
                            {m.confidence && ` (${(m.confidence * 100).toFixed(0)}%)`}
                          </span>
                          {m.category && (
                            <span className="text-[10px] text-slate-400 font-medium">{m.category}</span>
                          )}
                        </div>
                      )}

                      <p className="whitespace-pre-wrap">{m.text}</p>

                      {/* Suggested FAQs */}
                      {m.suggestedFAQs && m.suggestedFAQs.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
                          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            Suggested FAQs:
                          </p>
                          <div className="space-y-1.5">
                            {m.suggestedFAQs.map((sf) => (
                              <button
                                key={sf.id}
                                onClick={() => handleSend(sf.question)}
                                className="w-full text-left p-2 rounded-xl bg-slate-50 dark:bg-slate-700/60 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs font-semibold transition flex items-center justify-between"
                              >
                                <span className="line-clamp-1">? {sf.question}</span>
                                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Related Questions */}
                      {m.relatedQuestions && m.relatedQuestions.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Related Questions:
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {m.relatedQuestions.map((rq, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSend(rq)}
                                className="text-[10px] bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-lg transition"
                              >
                                + {rq}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50 text-[10px] text-slate-400">
                        <span>{m.time}</span>
                        {m.sender === 'ai' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleTextToSpeech(m.id, m.text)}
                              className="hover:text-purple-600 transition"
                              title="Read aloud"
                            >
                              {speakingMsgId === m.id ? (
                                <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleCopy(m.id, m.text)}
                              className="hover:text-purple-600 transition flex items-center gap-1"
                              title="Copy message"
                            >
                              {copiedId === m.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-3xl rounded-tl-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-purple-600 animate-bounce"></span>
                      <span className="h-2 w-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="h-2 w-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      Thinking...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Live Auto-Complete Suggestions */}
            {liveSuggestions.length > 0 && (
              <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/80 border-t border-blue-200 dark:border-blue-800 text-xs space-y-1 max-h-28 overflow-y-auto">
                <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> Matching FAQs:
                </p>
                {liveSuggestions.map((sug) => (
                  <button
                    key={sug.id}
                    onClick={() => handleSend(sug.question)}
                    className="w-full text-left p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-blue-900 dark:text-blue-100 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
                  >
                    <span className="line-clamp-1">{sug.question}</span>
                    <span className="text-[10px] bg-blue-200/60 dark:bg-blue-900 px-2 py-0.5 rounded text-blue-800 dark:text-blue-200 shrink-0">
                      {sug.category}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Suggested Quick Prompts */}
            <div className="px-4 py-2.5 bg-slate-100/60 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-2 whitespace-nowrap">
                {SUGGESTED_QUICK_PROMPTS.map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(promptText)}
                    disabled={loading}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition shadow-2xs shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`h-11 w-11 rounded-2xl flex items-center justify-center transition shrink-0 cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
                title={isListening ? 'Listening...' : 'Voice Input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <div className="flex-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-2 focus-within:border-blue-500 transition">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={isListening ? 'Listening...' : 'Type your question here... (e.g. How do I apply for leave?)'}
                  rows={1}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 resize-none focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="h-11 w-11 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold hover:opacity-90 disabled:opacity-40 transition shadow-lg shadow-blue-500/20 shrink-0 cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Sidebar - Campus AI Capabilities & Shortcuts (1 col) */}
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>AI Assistant Capabilities</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Campus AI is fine-tuned to answer student and faculty queries across all operational modules:
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Academic & Results</h4>
                    <p className="text-[11px] text-slate-500">CGPA/SGPA calculations, arrear tracking, hall tickets.</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Leaves & Complaints</h4>
                    <p className="text-[11px] text-slate-500">OD approvals, medical leaves, hostel Wi-Fi tickets.</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Placements & Projects</h4>
                    <p className="text-[11px] text-slate-500">Resume ATS optimization, mock interviews, teammate matching.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Offline FAQ Sync Status */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-3xl border border-indigo-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold text-xs">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Zero Latency Local Engine</span>
              </div>
              <p className="text-xs text-indigo-800 dark:text-slate-300 leading-relaxed">
                {faqs.length} FAQs are cached locally in your browser. Queries matching campus rules execute in under 1 millisecond.
              </p>
            </div>

          </div>
        </div>
      ) : (
        /* FAQ Knowledge Library Browser */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Campus Knowledge Base
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Browse official pre-loaded FAQs across all campus modules
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFaqs.length === 0 ? (
              <div className="col-span-full text-center py-12 space-y-2">
                <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-500">No FAQs found matching your filter.</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-300 dark:hover:border-blue-800 transition space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 uppercase tracking-wider">
                      {faq.category}
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab('chat');
                        handleSend(faq.question);
                      }}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ask AI</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {faq.question}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>

                  {faq.keywords && faq.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {faq.keywords.map((kw, i) => (
                        <span key={i} className="text-[10px] bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
};
