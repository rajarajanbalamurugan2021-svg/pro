import React, { useState } from 'react';
import {
  GateResource,
  GatePaper,
  GateResourceType,
  GateDifficulty,
  ResourceStatus
} from '../../../types/gate';
import {
  Upload,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  FolderPlus,
  Tag,
  Link as LinkIcon,
  HelpCircle,
  FileCode,
  Layers
} from 'lucide-react';

interface ResourceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { id: string; name: string; role: string };
  onUploadResource: (data: Omit<GateResource, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'downloadCount' | 'viewCount'>) => void;
  replaceResourceTarget?: GateResource | null;
  onReplaceFile?: (id: string, fileData: { fileUrl: string; fileName: string; fileSize: number; fileType: string }) => void;
}

const RESOURCE_TYPES: { id: GateResourceType; label: string }[] = [
  { id: 'PYQS', label: 'Previous Year Questions (PYQs)' },
  { id: 'PYQ_PAPER', label: 'Previous Year Question Paper' },
  { id: 'PRACTICE_QUESTIONS', label: 'Practice Questions' },
  { id: 'MOCK_TEST', label: 'Mock Test Paper' },
  { id: 'FORMULA_SHEET', label: 'Formula Cheat Sheet' },
  { id: 'STUDY_NOTES', label: 'Study Notes & Handouts' },
  { id: 'SYLLABUS', label: 'GATE Official Syllabus' },
  { id: 'ANSWER_KEY', label: 'Answer Key' },
  { id: 'DETAILED_SOLUTION', label: 'Detailed Step-by-Step Solution' },
  { id: 'REFERENCE_BOOK', label: 'Reference Book Chapter' },
  { id: 'PREPARATION_GUIDE', label: 'Preparation Strategy Guide' },
  { id: 'REVISION_NOTES', label: 'Quick Revision Notes' },
  { id: 'IMPORTANT_QUESTIONS', label: 'Important Selected Questions' },
  { id: 'SUBJECT_NOTES', label: 'Subject-Wise Master Notes' },
  { id: 'TOPIC_NOTES', label: 'Topic-Wise Notes' },
  { id: 'INTERVIEW_PREP', label: 'PSU / M.Tech Interview Prep' },
  { id: 'OTHER', label: 'Other Educational Resource' }
];

export const ResourceUploadModal: React.FC<ResourceUploadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUploadResource,
  replaceResourceTarget,
  onReplaceFile
}) => {
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Form State
  const [title, setTitle] = useState(replaceResourceTarget ? replaceResourceTarget.title : '');
  const [description, setDescription] = useState(replaceResourceTarget ? replaceResourceTarget.description : '');
  const [gatePaper, setGatePaper] = useState<GatePaper>(replaceResourceTarget ? replaceResourceTarget.gatePaper : 'ECE');
  const [subject, setSubject] = useState(replaceResourceTarget ? replaceResourceTarget.subject : 'Signals and Systems');
  const [topic, setTopic] = useState(replaceResourceTarget ? replaceResourceTarget.topic : 'Fourier Transform');
  const [subtopic, setSubtopic] = useState(replaceResourceTarget ? replaceResourceTarget.subtopic || '' : '');
  const [resourceType, setResourceType] = useState<GateResourceType>(replaceResourceTarget ? (replaceResourceTarget.resourceType as GateResourceType) : 'STUDY_NOTES');
  const [year, setYear] = useState<number>(replaceResourceTarget?.year || 2025);
  const [difficulty, setDifficulty] = useState<GateDifficulty>(replaceResourceTarget?.difficulty || 'MEDIUM');
  const [tags, setTags] = useState<string>(replaceResourceTarget ? replaceResourceTarget.tags.join(', ') : 'GATE2025, Notes');
  const [externalSourceUrl, setExternalSourceUrl] = useState(replaceResourceTarget?.externalSourceUrl || '');
  const [status, setStatus] = useState<ResourceStatus>('PUBLISHED');
  const [copyrightNotes, setCopyrightNotes] = useState(replaceResourceTarget?.copyrightNotes || 'Academic Archive');

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray: File[] = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      if (filesArray.length > 0 && !title && !replaceResourceTarget) {
        setTitle(filesArray[0].name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (replaceResourceTarget && onReplaceFile) {
      // Replacement mode
      const dummyFileUrl = selectedFiles.length > 0
        ? URL.createObjectURL(selectedFiles[0])
        : replaceResourceTarget.fileUrl;
      const fileName = selectedFiles.length > 0 ? selectedFiles[0].name : replaceResourceTarget.fileName;
      const fileSize = selectedFiles.length > 0 ? selectedFiles[0].size : replaceResourceTarget.fileSize;
      const fileType = selectedFiles.length > 0 ? selectedFiles[0].type || 'application/pdf' : replaceResourceTarget.fileType;

      onReplaceFile(replaceResourceTarget.id, {
        fileUrl: dummyFileUrl,
        fileName,
        fileSize,
        fileType
      });
      onClose();
      return;
    }

    // Normal Upload Mode
    setUploadProgress(20);
    const file = selectedFiles[0];
    const fileUrl = file ? URL.createObjectURL(file) : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    const fileName = file ? file.name : `${title.replace(/\s+/g, '_')}.pdf`;
    const fileSize = file ? file.size : 1500000;
    const fileType = file ? file.type || 'application/pdf' : 'application/pdf';

    setTimeout(() => {
      setUploadProgress(70);
      setTimeout(() => {
        setUploadProgress(100);
        onUploadResource({
          title,
          description,
          branch: gatePaper,
          gatePaper,
          subject,
          topic,
          subtopic,
          resourceType,
          year,
          difficulty,
          fileUrl,
          fileName,
          fileSize,
          fileType,
          externalSourceUrl: externalSourceUrl || undefined,
          uploadedBy: currentUser.id,
          uploadedByName: currentUser.name,
          uploadedByRole: currentUser.role,
          status,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          copyrightNotes
        });

        setUploadProgress(null);
        onClose();
      }, 300);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20">
              <Upload className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black">
                {replaceResourceTarget ? `Replace PDF / Update File (v${replaceResourceTarget.version + 1})` : 'Upload GATE Educational Resource'}
              </h2>
              <p className="text-xs text-slate-300">
                Supports PDF, DOCX, PPTX, XLS, CSV and study materials for GATE ECE, EEE, ME, CE.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar if Uploading */}
        {uploadProgress !== null && (
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* File Dropzone */}
          <div className="border-2 border-dashed border-blue-300 dark:border-slate-700 bg-blue-50/50 dark:bg-slate-800/40 p-6 rounded-3xl text-center space-y-3">
            <Upload className="w-8 h-8 mx-auto text-blue-600 dark:text-blue-400 animate-bounce" />
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {selectedFiles.length > 0
                  ? `Selected: ${selectedFiles.map(f => f.name).join(', ')}`
                  : replaceResourceTarget
                  ? `Current File: ${replaceResourceTarget.fileName} (Click below to select new file)`
                  : 'Drag & Drop educational files here or Browse'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, CSV, PNG, JPG up to 50MB
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer transition shadow-md">
              <Plus className="w-4 h-4" />
              <span>Choose Educational File</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,image/*"
                multiple={isBulkMode}
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          {/* Paper & Resource Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                GATE Paper / Branch *
              </label>
              <select
                value={gatePaper}
                onChange={(e) => setGatePaper(e.target.value as GatePaper)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              >
                <option value="ECE">GATE ECE (Electronics)</option>
                <option value="EEE">GATE EEE (Electrical)</option>
                <option value="ME">GATE ME (Mechanical)</option>
                <option value="CE">GATE CE (Civil)</option>
                <option value="CSE">GATE CSE (Computer Science)</option>
                <option value="AIDS">GATE AI & DS (Data Science & AI)</option>
                <option value="BM">GATE BM (Biomedical Engg)</option>
                <option value="RO">GATE RO (Robotics & Automation)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Resource Category *
              </label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value as GateResourceType)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Target Exam Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || 2025)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. GATE 2024 Signals & Systems Official Question Paper & Solutions"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          {/* Subject, Topic, Subtopic */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Subject *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Signals and Systems"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Topic *
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Fourier Transform"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as GateDifficulty)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="ADVANCED">Advanced / IISc Level</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Description & Summary
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide key highlights, topic coverage, or notes about this document..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          {/* Tags & External Source URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="GATE2025, PYQ, FormulaSheet"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                External Reference URL (Optional)
              </label>
              <input
                type="url"
                value={externalSourceUrl}
                onChange={(e) => setExternalSourceUrl(e.target.value)}
                placeholder="https://gate.iisc.ac.in/..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Bottom Action buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">Status:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ResourceStatus)}
                className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="PENDING_REVIEW">Submit for Review</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:from-blue-700 hover:to-indigo-700"
              >
                {replaceResourceTarget ? 'Replace File & Save' : 'Upload Educational Resource'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
