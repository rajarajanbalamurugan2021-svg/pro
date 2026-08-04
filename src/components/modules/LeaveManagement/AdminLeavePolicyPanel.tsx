import React, { useState } from 'react';
import { LeaveTypeConfig, AcademicHoliday, LeavePolicyConfig, LeaveRequest } from '../../../types';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  ShieldCheck, 
  Check, 
  X, 
  Sliders, 
  Bell, 
  BookOpen, 
  Download, 
  BarChart2,
  FileSpreadsheet
} from 'lucide-react';

interface AdminLeavePolicyPanelProps {
  leaveTypes: LeaveTypeConfig[];
  holidays: AcademicHoliday[];
  policy: LeavePolicyConfig;
  allLeaves: LeaveRequest[];
  onSaveLeaveTypes: (types: LeaveTypeConfig[]) => void;
  onSaveHolidays: (holidays: AcademicHoliday[]) => void;
  onSavePolicy: (policy: LeavePolicyConfig) => void;
  onOpenReportExporter: () => void;
}

export const AdminLeavePolicyPanel: React.FC<AdminLeavePolicyPanelProps> = ({
  leaveTypes,
  holidays,
  policy,
  allLeaves,
  onSaveLeaveTypes,
  onSaveHolidays,
  onSavePolicy,
  onOpenReportExporter
}) => {
  const [activeTab, setActiveTab] = useState<'TYPES' | 'POLICY' | 'HOLIDAYS' | 'ANALYTICS'>('TYPES');
  
  // Local state for adding/editing leave types
  const [isTypeModalOpen, setIsTypeModalOpen] = useState<boolean>(false);
  const [editingType, setEditingType] = useState<LeaveTypeConfig | null>(null);
  const [typeName, setTypeName] = useState<string>('');
  const [typeMaxDays, setTypeMaxDays] = useState<number>(10);
  const [typeRequiresHOD, setTypeRequiresHOD] = useState<boolean>(true);
  const [typeCategory, setTypeCategory] = useState<'Academic' | 'Medical' | 'Personal' | 'Co-curricular'>('Academic');
  const [typeDesc, setTypeDesc] = useState<string>('');

  // Local state for policy form
  const [policyThreshold, setPolicyThreshold] = useState<number>(policy.hodApprovalThresholdDays || 3);
  const [policyMaxSemester, setPolicyMaxSemester] = useState<number>(policy.maxLeaveDaysPerSemester || 15);
  const [policyParentSMS, setPolicyParentSMS] = useState<boolean>(policy.enableParentSMS !== false);

  // Local state for holidays
  const [newHolidayName, setNewHolidayName] = useState<string>('');
  const [newHolidayDate, setNewHolidayDate] = useState<string>('');
  const [newHolidayType, setNewHolidayType] = useState<AcademicHoliday['type']>('Public Holiday');

  // Open modal to add or edit leave type
  const openLeaveTypeModal = (typeToEdit?: LeaveTypeConfig) => {
    if (typeToEdit) {
      setEditingType(typeToEdit);
      setTypeName(typeToEdit.name || typeToEdit.leaveTypeName);
      setTypeMaxDays(typeToEdit.maxDays);
      setTypeRequiresHOD(typeToEdit.requiresHODApproval);
      setTypeCategory(typeToEdit.category || 'Academic');
      setTypeDesc(typeToEdit.description || '');
    } else {
      setEditingType(null);
      setTypeName('');
      setTypeMaxDays(10);
      setTypeRequiresHOD(true);
      setTypeCategory('Academic');
      setTypeDesc('');
    }
    setIsTypeModalOpen(true);
  };

  const handleSaveLeaveType = () => {
    if (!typeName.trim()) return;

    if (editingType) {
      const updated = leaveTypes.map(t => 
        t.id === editingType.id 
          ? { ...t, name: typeName, leaveTypeName: typeName, maxDays: typeMaxDays, requiresHODApproval: typeRequiresHOD, category: typeCategory, description: typeDesc }
          : t
      );
      onSaveLeaveTypes(updated);
    } else {
      const newType: LeaveTypeConfig = {
        id: `lt-${Date.now()}`,
        leaveTypeId: `LT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        leaveTypeName: typeName,
        name: typeName,
        maxDays: typeMaxDays,
        requiresHODApproval: typeRequiresHOD,
        category: typeCategory,
        description: typeDesc,
        active: true
      };
      onSaveLeaveTypes([...leaveTypes, newType]);
    }

    setIsTypeModalOpen(false);
  };

  const handleDeleteLeaveType = (id: string) => {
    onSaveLeaveTypes(leaveTypes.filter(t => t.id !== id));
  };

  const handleToggleActiveType = (id: string) => {
    onSaveLeaveTypes(leaveTypes.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  const handleSavePolicySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePolicy({
      ...policy,
      hodApprovalThresholdDays: policyThreshold,
      maxLeaveDaysPerSemester: policyMaxSemester,
      enableParentSMS: policyParentSMS
    });
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayName.trim() || !newHolidayDate) return;

    const newHol: AcademicHoliday = {
      id: `hol-${Date.now()}`,
      name: newHolidayName.trim(),
      date: newHolidayDate,
      type: newHolidayType,
      description: 'Added by Administrator'
    };

    onSaveHolidays([...holidays, newHol]);
    setNewHolidayName('');
    setNewHolidayDate('');
  };

  const handleDeleteHoliday = (id: string) => {
    onSaveHolidays(holidays.filter(h => h.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Panel Header & Sub-Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Settings className="w-5 h-5 text-sky-600" />
              <span>Leave System Policy & Workflows Administration</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Configure leave types, approval thresholds, parent notification triggers, and academic calendar.</p>
          </div>

          <button
            onClick={onOpenReportExporter}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/20 flex items-center space-x-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export Global System Reports</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'TYPES', label: `Manage Leave Types (${leaveTypes.length})`, icon: Sliders },
            { id: 'POLICY', label: 'Approval Policy & Thresholds', icon: ShieldCheck },
            { id: 'HOLIDAYS', label: `Academic Holidays (${holidays.length})`, icon: Calendar },
            { id: 'ANALYTICS', label: 'Global Analytics & Export', icon: BarChart2 }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* TAB 1: MANAGE LEAVE TYPES */}
      {activeTab === 'TYPES' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Leave Categories & Standard Policies</h3>
              <p className="text-xs text-slate-500">Add, configure, or disable leave types available to students.</p>
            </div>

            <button
              onClick={() => openLeaveTypeModal()}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Leave Type</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leaveTypes.map(lt => (
              <div 
                key={lt.id}
                className={`p-4 border rounded-xl transition-all space-y-3 ${
                  lt.active !== false ? 'bg-white border-slate-200 hover:border-sky-300' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{lt.name || lt.leaveTypeName}</span>
                      <span className="px-2 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-bold rounded-md">
                        {lt.category || 'Academic'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{lt.description || 'Standard academic leave category'}</p>
                  </div>

                  <button
                    onClick={() => handleToggleActiveType(lt.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                      lt.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {lt.active !== false ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block font-medium">Max Limit</span>
                    <span className="font-bold text-slate-800">{lt.maxDays} Days / Semester</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">HOD Sign-off</span>
                    <span className="font-bold text-purple-700">
                      {lt.requiresHODApproval ? 'Required (>3 days)' : 'Optional'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-1">
                  <button
                    onClick={() => openLeaveTypeModal(lt)}
                    className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold flex items-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteLeaveType(lt.id)}
                    className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: APPROVAL POLICY & THRESHOLDS */}
      {activeTab === 'POLICY' && (
        <form onSubmit={handleSavePolicySubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 max-w-2xl">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Workflow Routing & Threshold Rules</h3>
            <p className="text-xs text-slate-500">Configure global rules for leave escalation and parent notifications.</p>
          </div>

          <div className="space-y-4 text-xs">
            
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                HOD Escalation Threshold (Days)
              </label>
              <p className="text-slate-500 mb-2">Leave applications exceeding this duration automatically mandate Head of Department sign-off.</p>
              <input
                type="number"
                min={1}
                max={30}
                value={policyThreshold}
                onChange={(e) => setPolicyThreshold(Number(e.target.value))}
                className="w-full max-w-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Maximum Total Leave Days Per Semester
              </label>
              <p className="text-slate-500 mb-2">Hard cap limit per student for casual & emergency leaves per semester.</p>
              <input
                type="number"
                min={5}
                max={60}
                value={policyMaxSemester}
                onChange={(e) => setPolicyMaxSemester(Number(e.target.value))}
                className="w-full max-w-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={policyParentSMS}
                  onChange={(e) => setPolicyParentSMS(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                />
                <div>
                  <span className="font-bold text-slate-800 block">Automatic Parent / Guardian SMS Alerts</span>
                  <span className="text-slate-500">Send automated SMS notifications to parent contact phone numbers when leave status changes.</span>
                </div>
              </label>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/20 transition-all"
            >
              Save Policy Rules
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: ACADEMIC HOLIDAYS */}
      {activeTab === 'HOLIDAYS' && (
        <div className="space-y-6">
          
          {/* Add Holiday Form */}
          <form onSubmit={handleAddHoliday} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Academic Public Holiday / Festival</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                value={newHolidayName}
                onChange={(e) => setNewHolidayName(e.target.value)}
                placeholder="Holiday Name (e.g. Independence Day)..."
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />

              <input
                type="date"
                value={newHolidayDate}
                onChange={(e) => setNewHolidayDate(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />

              <select
                value={newHolidayType}
                onChange={(e) => setNewHolidayType(e.target.value as any)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Public Holiday">Public Holiday</option>
                <option value="University Festival">University Festival</option>
                <option value="Vacation">Vacation</option>
                <option value="Exam Period">Exam Period</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Holiday</span>
              </button>
            </div>
          </form>

          {/* Holiday List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Academic Calendar Public Holidays</h3>

            <div className="divide-y divide-slate-100">
              {holidays.map(hol => (
                <div key={hol.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">{hol.name}</span>
                      <span className="text-slate-500 font-mono">{hol.date} {hol.endDate ? `to ${hol.endDate}` : ''}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-md text-[10px]">
                      {hol.type}
                    </span>
                    <button
                      onClick={() => handleDeleteHoliday(hol.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: GLOBAL ANALYTICS & EXPORT */}
      {activeTab === 'ANALYTICS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">System-wide Leave Analytics</h3>
              <p className="text-xs text-slate-500">Cross-department statistics & reporting center.</p>
            </div>
            <button
              onClick={onOpenReportExporter}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Generate & Download Reports</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-slate-400 font-medium">Total Applications Filed</span>
              <span className="text-2xl font-black text-slate-900 block">{allLeaves.length}</span>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-emerald-700 font-medium">Total Approved Sanctions</span>
              <span className="text-2xl font-black text-emerald-950 block">
                {allLeaves.filter(l => l.status === 'Approved').length}
              </span>
            </div>
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <span className="text-rose-700 font-medium">Total Declined Applications</span>
              <span className="text-2xl font-black text-rose-950 block">
                {allLeaves.filter(l => l.status === 'Rejected').length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal to Create/Edit Leave Type */}
      {isTypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingType ? 'Edit Leave Type' : 'Add New Leave Type'}
              </h3>
              <button onClick={() => setIsTypeModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Leave Type Name</label>
                <input
                  type="text"
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  placeholder="e.g. Research Paper Leave..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Max Days / Semester</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={typeMaxDays}
                  onChange={(e) => setTypeMaxDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={typeCategory}
                  onChange={(e) => setTypeCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Academic">Academic</option>
                  <option value="Medical">Medical</option>
                  <option value="Personal">Personal</option>
                  <option value="Co-curricular">Co-curricular</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2.5 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={typeRequiresHOD}
                    onChange={(e) => setTypeRequiresHOD(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                  />
                  <span className="font-bold text-slate-800">Requires HOD Approval for long leaves</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsTypeModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLeaveType}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                Save Leave Type
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
