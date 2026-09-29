import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Upload,
  RefreshCw,
  Send,
  Zap,
  Sparkles,
  Download,
  Eye,
  Filter,
  Check,
  Globe,
  WifiOff,
  Bot
} from 'lucide-react';
import { FAQItem } from '../../../types';
import {
  getStoredFAQs,
  addFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFAQStatus,
  bulkUploadFAQs,
  subscribeToFAQs,
  useOnlineStatus
} from '../../../services/faqService';
import { findBestFAQMatch, FAQMatchResult } from '../../../utils/faqMatchingEngine';

const CATEGORIES = [
  'All',
  'General',
  'Student Module',
  'Faculty Module',
  'Admin Module',
  'Leave Management',
  'Complaint Management',
  'Project Collaboration',
  'Community Hub',
  'Internship Module',
  'Placement Module',
  'AI Career Module',
  'Lab Module',
  'Notifications'
];

export const FAQManager: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    category: 'General',
    question: '',
    keywords: '',
    answer: '',
    relatedQuestions: '',
    status: 'active' as 'active' | 'inactive'
  });

  // Live Test Chatbot State
  const [testQuery, setTestQuery] = useState<string>('');
  const [testResult, setTestResult] = useState<FAQMatchResult | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(true);

  const { isOnline, lastSynced } = useOnlineStatus();

  useEffect(() => {
    const unsub = subscribeToFAQs((updatedFaqs) => {
      setFaqs(updatedFaqs);
    });
    return () => unsub();
  }, []);

  // Filtered FAQs
  const filteredFaqs = faqs.filter((f) => {
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch =
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.keywords || []).some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleOpenModal = (faq?: FAQItem) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        category: faq.category,
        question: faq.question,
        keywords: (faq.keywords || []).join(', '),
        answer: faq.answer,
        relatedQuestions: (faq.relatedQuestions || []).join(', '),
        status: faq.status || 'active'
      });
    } else {
      setEditingFaq(null);
      setFormData({
        category: 'General',
        question: '',
        keywords: '',
        answer: '',
        relatedQuestions: '',
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) return;

    const keywordsArray = formData.keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const relatedArray = formData.relatedQuestions
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    if (editingFaq) {
      await updateFAQ({
        ...editingFaq,
        category: formData.category,
        question: formData.question.trim(),
        keywords: keywordsArray,
        answer: formData.answer.trim(),
        relatedQuestions: relatedArray,
        status: formData.status
      });
    } else {
      await addFAQ({
        category: formData.category,
        question: formData.question.trim(),
        keywords: keywordsArray,
        answer: formData.answer.trim(),
        relatedQuestions: relatedArray,
        status: formData.status
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ item?')) {
      await deleteFAQ(id);
    }
  };

  const handleToggle = async (id: string) => {
    await toggleFAQStatus(id);
  };

  const handleTestEngine = () => {
    if (!testQuery.trim()) return;
    const res = findBestFAQMatch(testQuery, faqs);
    setTestResult(res);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(faqs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ckcet_campro_faqs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            await bulkUploadFAQs(parsed);
            alert(`Successfully imported ${parsed.length} FAQs!`);
          } else {
            alert('Invalid JSON structure. Please upload an array of FAQ objects.');
          }
        } catch (err) {
          alert('Error parsing JSON file. Please check file formatting.');
        }
      };
    }
  };

  return (
    <div id="faq-manager-root" className="space-y-6">
      {/* Top Banner & Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Offline AI FAQ Knowledge Base Manager</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                isOnline ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {isOnline ? <Globe className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                {isOnline ? 'Online Sync Active' : 'Offline Mode (Local Cache)'}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Manage pre-built FAQs for instant offline responses. Changes automatically synchronize with Firebase Firestore when online.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import JSON
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleExportJSON}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>

          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total FAQs</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{faqs.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Active FAQs</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {faqs.filter((f) => f.status !== 'inactive').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Categories Supported</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{CATEGORIES.length - 1}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Last Synced</p>
          <p className="text-sm font-semibold text-slate-700 mt-2">{lastSynced}</p>
        </div>
      </div>

      {/* Main Grid: FAQs Table & Live Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: FAQ List & Search */}
        <div className={isPreviewOpen ? 'lg:col-span-8 space-y-4' : 'lg:col-span-12 space-y-4'}>
          {/* Filters & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions, keywords, or answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                className={`p-2 rounded-xl border text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  isPreviewOpen ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
                title="Toggle Live Chatbot Preview"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Tester</span>
              </button>
            </div>
          </div>

          {/* Table / List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Question & Keywords</th>
                    <th className="px-4 py-3">Answer</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFaqs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400">
                        No FAQs found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredFaqs.map((faq) => (
                      <tr key={faq.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            {faq.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <p className="font-semibold text-slate-900 line-clamp-2">{faq.question}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(faq.keywords || []).slice(0, 4).map((kw, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                                #{kw}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 max-w-sm text-slate-600">
                          <p className="line-clamp-2">{faq.answer}</p>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggle(faq.id)}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                              faq.status !== 'inactive'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {faq.status !== 'inactive' ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" /> Inactive
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenModal(faq)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit FAQ"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(faq.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete FAQ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Live Chatbot Matching Engine Simulator */}
        {isPreviewOpen && (
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 h-fit sticky top-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">Live FAQ Match Tester</h3>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">Offline Engine</span>
            </div>

            <p className="text-xs text-slate-500">
              Type a test question to verify how the offline matching engine computes confidence, fuzzy distance, and related FAQs.
            </p>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., How do I apply for leave?"
                  value={testQuery}
                  onChange={(e) => setTestQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTestEngine()}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  onClick={handleTestEngine}
                  className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {testResult && (
              <div className="mt-4 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Confidence Score:</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded ${
                      testResult.confidence >= 0.5
                        ? 'bg-emerald-100 text-emerald-800'
                        : testResult.confidence >= 0.3
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {(testResult.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                {testResult.topMatch ? (
                  <div className="space-y-2 border-t border-slate-200 pt-2">
                    <p className="font-semibold text-blue-700">Top Match ({testResult.topMatch.category}):</p>
                    <p className="font-bold text-slate-900">{testResult.topMatch.question}</p>
                    <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                      {testResult.topMatch.answer}
                    </p>
                  </div>
                ) : (
                  <div className="text-rose-600 font-medium">
                    No high-confidence match found for this query. Showing fallback suggestions.
                  </div>
                )}

                {testResult.relatedQuestions.length > 0 && (
                  <div className="border-t border-slate-200 pt-2 space-y-1">
                    <p className="font-semibold text-slate-700">Related Questions:</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      {testResult.relatedQuestions.map((q, idx) => (
                        <li key={idx} className="line-clamp-1">{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">
                {editingFaq ? 'Edit FAQ Item' : 'Add New FAQ Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., How do I reset my password?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keywords (Comma-separated for matching engine)
                </label>
                <input
                  type="text"
                  placeholder="e.g., reset, password, credentials, forgot"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Answer</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed answer text..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Related Questions (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., How do I login?, Who can I contact?"
                  value={formData.relatedQuestions}
                  onChange={(e) => setFormData({ ...formData, relatedQuestions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
