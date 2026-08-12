import React, { useState, useRef } from 'react';
import { User } from '../../../types';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  RefreshCw,
  FileText,
  UserCheck,
  Shield,
  X,
  FileCheck,
  HelpCircle
} from 'lucide-react';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface ParsedStudentRow {
  id: string;
  email: string;
  password: string;
  name: string;
  rollNumber: string;
  department: string;
  year: string;
  status: 'valid' | 'invalid';
  errors: string[];
  excluded?: boolean;
}

export interface ImportResultRow {
  email: string;
  name: string;
  rollNumber: string;
  department: string;
  status: 'created' | 'failed' | 'skipped';
  message: string;
  userId?: string;
}

interface BulkStudentImportProps {
  onImportSuccess?: (newUsers: User[]) => void;
  onClose?: () => void;
}

export const BulkStudentImport: React.FC<BulkStudentImportProps> = ({
  onImportSuccess,
  onClose
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'invalid'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<ImportResultRow[] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Download sample CSV template
  const handleDownloadTemplate = () => {
    const csvContent =
      'email,password,name,rollNumber,department,year\n' +
      'student1@ckcet.edu.in,Pass123!,Rajesh Kumar,21EC001,ECE,3\n' +
      'student2@ckcet.edu.in,Pass123!,Priya Sharma,21CS002,CSE,3\n' +
      'student3@ckcet.edu.in,Pass123!,Arun Patel,22AI003,AIDS,2\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CKCET_Bulk_Student_Import_Template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle file drop / selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = async (selectedFile: File) => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls', 'pdf'].includes(ext || '')) {
      setParseError('Unsupported file format. Please upload a .csv, .xlsx, .xls, or .pdf file.');
      return;
    }

    setFile(selectedFile);
    setParseError(null);
    setIsParsing(true);
    setParsedRows([]);
    setImportResults(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/admin/bulk-import/parse', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to parse file on server');
      }

      const data = await response.json();
      if (!data.rows || !Array.isArray(data.rows)) {
        throw new Error('Invalid response structure from parser server');
      }

      setParsedRows(data.rows);
    } catch (err: any) {
      console.error('File parse error:', err);
      setParseError(err.message || 'Error reading file. Please check column formatting.');
    } finally {
      setIsParsing(false);
    }
  };

  // Toggle exclusion of a single row
  const toggleExcludeRow = (id: string) => {
    setParsedRows(prev =>
      prev.map(r => (r.id === id ? { ...r, excluded: !r.excluded } : r))
    );
  };

  // Inline edit of a cell
  const handleCellEdit = (id: string, field: keyof ParsedStudentRow, val: string) => {
    setParsedRows(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        const updated = { ...r, [field]: val };
        
        // Re-validate row client-side
        const errors: string[] = [];
        if (!updated.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updated.email)) {
          errors.push('Invalid email format');
        }
        if (!updated.password || updated.password.length < 6) {
          errors.push('Password must be at least 6 characters');
        }
        updated.errors = errors;
        updated.status = errors.length === 0 ? 'valid' : 'invalid';
        return updated;
      })
    );
  };

  // Filtered rows for table
  const displayedRows = parsedRows.filter(r => {
    if (filterStatus === 'valid' && r.status !== 'valid') return false;
    if (filterStatus === 'invalid' && r.status !== 'invalid') return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        r.email.toLowerCase().includes(term) ||
        r.name.toLowerCase().includes(term) ||
        r.rollNumber.toLowerCase().includes(term) ||
        r.department.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const validRowsCount = parsedRows.filter(r => r.status === 'valid' && !r.excluded).length;
  const invalidRowsCount = parsedRows.filter(r => r.status === 'invalid' && !r.excluded).length;

  // Execute Bulk Account Creation
  const handleConfirmImport = async () => {
    const rowsToImport = parsedRows.filter(r => r.status === 'valid' && !r.excluded);
    if (rowsToImport.length === 0) {
      alert('No valid non-excluded student rows available to import.');
      return;
    }

    setIsImporting(true);
    setImportProgress(10);

    try {
      const response = await fetch('/api/admin/bulk-import/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: rowsToImport })
      });

      setImportProgress(70);

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Server error creating accounts');
      }

      const resultData = await response.json();
      setImportProgress(100);
      setImportResults(resultData.results || []);

      // Store audit batch summary in Firestore (NO plaintext passwords!)
      if (db) {
        addDoc(collection(db, 'importBatches'), {
          fileName: file?.name || 'bulk_import',
          totalRequested: rowsToImport.length,
          createdCount: resultData.summary?.created || 0,
          failedCount: resultData.summary?.failed || 0,
          importedAt: Date.now(),
          createdAtIso: new Date().toISOString()
        }).catch(err => console.warn('Audit batch doc save notice:', err));
      }

      if (onImportSuccess && resultData.createdUsers && resultData.createdUsers.length > 0) {
        onImportSuccess(resultData.createdUsers);
      }
    } catch (err: any) {
      console.error('Import execution error:', err);
      alert(`Import failed: ${err.message || 'Unknown server error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  // Export Results as CSV
  const handleDownloadResults = () => {
    if (!importResults) return;
    let csv = 'Email,Name,Roll Number,Department,Status,Details\n';
    importResults.forEach(r => {
      csv += `"${r.email}","${r.name}","${r.rollNumber}","${r.department}","${r.status}","${r.message.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bulk_Import_Results_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <UserCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Bulk Student Credentials Provisioning
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload CSV, Excel, or PDF rosters to batch-create Firebase Authentication accounts and Student Profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
          >
            <Download className="w-4 h-4 text-purple-500" />
            <span>Download CSV Template</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* File Upload Zone */}
      {!file || parsedRows.length === 0 ? (
        <div
          onDragOver={e => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-purple-500 bg-purple-500/5'
              : 'border-slate-300 dark:border-slate-700 hover:border-purple-400 bg-slate-50/50 dark:bg-slate-950/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .xlsx, .xls, .pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Drag & Drop Student Credential File Here
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Supports <span className="font-semibold text-slate-700 dark:text-slate-300">.CSV</span>, <span className="font-semibold text-slate-700 dark:text-slate-300">.XLSX / .XLS</span>, and <span className="font-semibold text-slate-700 dark:text-slate-300">.PDF</span> table exports.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Browse Files</span>
          </div>

          {parseError && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium max-w-md mx-auto flex items-center gap-2 justify-center">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {isParsing && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Parsing and validating student records...</span>
            </div>
          )}
        </div>
      ) : null}

      {/* Import Progress Indicator */}
      {isImporting && (
        <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-purple-900 dark:text-purple-200">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-500" />
              Creating Firebase Auth & Firestore Student Records...
            </span>
            <span>{importProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-600 h-2 transition-all duration-300"
              style={{ width: `${importProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Completion Summary Screen */}
      {importResults && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Bulk Import Completed Successfully
              </h3>
            </div>
            <button
              onClick={handleDownloadResults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Full Results CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Created</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {importResults.filter(r => r.status === 'created').length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Failed</span>
              <span className="text-lg font-black text-red-500">
                {importResults.filter(r => r.status === 'failed').length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Skipped</span>
              <span className="text-lg font-black text-amber-500">
                {importResults.filter(r => r.status === 'skipped').length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Parsed Preview Table & Verification Studio */}
      {parsedRows.length > 0 && !importResults && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Parsed Records ({parsedRows.length})
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {validRowsCount} Valid
              </span>
              {invalidRowsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                  {invalidRowsCount} Errors
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Search rows..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="all">Show All Rows</option>
                <option value="valid">Valid Only</option>
                <option value="invalid">Invalid Only</option>
              </select>

              <button
                onClick={() => {
                  setFile(null);
                  setParsedRows([]);
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition"
                title="Change File"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold sticky top-0 z-10">
                <tr>
                  <th className="p-3">Status</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Password</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Dept</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayedRows.map(row => {
                  const isErr = row.status === 'invalid';
                  const isExcluded = row.excluded;

                  return (
                    <tr
                      key={row.id}
                      className={`transition ${
                        isExcluded
                          ? 'opacity-40 bg-slate-50 dark:bg-slate-950/40'
                          : isErr
                          ? 'bg-red-50/50 dark:bg-red-950/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="p-3 whitespace-nowrap">
                        {isExcluded ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-500">
                            Excluded
                          </span>
                        ) : isErr ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400" title={row.errors.join(', ')}>
                            <AlertCircle className="w-3 h-3" />
                            <span>Error</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Valid</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3 font-mono">
                        <input
                          type="text"
                          value={row.email}
                          onChange={e => handleCellEdit(row.id, 'email', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent focus:border-purple-500 outline-none text-slate-900 dark:text-white"
                        />
                      </td>

                      <td className="p-3 font-mono text-slate-400">
                        <input
                          type="text"
                          value={row.password}
                          onChange={e => handleCellEdit(row.id, 'password', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent focus:border-purple-500 outline-none text-slate-900 dark:text-white"
                        />
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          value={row.name}
                          onChange={e => handleCellEdit(row.id, 'name', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent focus:border-purple-500 outline-none text-slate-900 dark:text-white"
                        />
                      </td>

                      <td className="p-3 font-mono uppercase">
                        <input
                          type="text"
                          value={row.rollNumber}
                          onChange={e => handleCellEdit(row.id, 'rollNumber', e.target.value)}
                          className="w-24 bg-transparent border-b border-transparent focus:border-purple-500 outline-none text-slate-900 dark:text-white"
                        />
                      </td>

                      <td className="p-3 uppercase">
                        <input
                          type="text"
                          value={row.department}
                          onChange={e => handleCellEdit(row.id, 'department', e.target.value)}
                          className="w-16 bg-transparent border-b border-transparent focus:border-purple-500 outline-none text-slate-900 dark:text-white"
                        />
                      </td>

                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => toggleExcludeRow(row.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                            isExcluded
                              ? 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {isExcluded ? 'Include' : 'Exclude'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Execution Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Ready to provision <strong className="text-slate-900 dark:text-white">{validRowsCount}</strong> valid student accounts.
            </span>

            <button
              onClick={handleConfirmImport}
              disabled={validRowsCount === 0 || isImporting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-purple-500/20 transition"
            >
              <UserCheck className="w-4 h-4" />
              <span>Confirm & Provision {validRowsCount} Accounts</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
