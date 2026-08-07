import React, { useState, useEffect } from 'react';
import { User } from '../../../types';
import { Save, CheckCircle2 } from 'lucide-react';

interface Props {
  user: User;
  onUpdateUser?: (updated: User) => void;
}

export const BasicInfoProfile: React.FC<Props> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    academicSession: user.academicSession || '2026-2027',
    department: user.department || 'ELECTRONICS AND COMMUNICATION ENGINEERING',
    programme: user.programme || 'BE ECE',
    currentSemester: user.semester ? `Sem ${user.semester}` : 'Sem 3',
    className: user.className || 'II ECE',
    rollNo: user.rollNumber || '36',
    registerNo: user.registerNo || '420725106036',
    title: user.title || '',
    firstName: user.firstName || (user.name ? user.name.split(' ')[0] : 'RAJARAJAN'),
    lastName: user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : 'B'),
    dateOfBirth: user.dateOfBirth || '04-09-2008',
    gender: user.gender || 'Male',
    email: user.email || 'rajarajan2008@ckcet.ac.in',
    officialEmail: user.officialEmail || user.email || 'rajarajan2008@ckcet.ac.in',
    contactNumber: user.phone || '9994454494',
    whatsappNumber: user.whatsappNumber || user.phone || '9994454494',
    religious: user.religion || 'Hindu',
    communalCategory: user.communalCategory || 'MBC',
    bloodGroup: user.bloodGroup || 'O+VE',
    country: user.country || '',
    state: user.state || '',
    district: user.district || '',
    cityVillage: user.cityVillage || '',
    address: user.address || '18, DURGA NAGAR, MANAKUPPAM, PACHCHYAKUPPAM, CUDDALORE',
    streetArea: user.streetArea || '',
    pinCode: user.pinCode || '',
    motherTongue: user.motherTongue || '',
    nationality: user.nationality || ''
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if user prop changes
  useEffect(() => {
    setFormData({
      academicSession: user.academicSession || '2026-2027',
      department: user.department || 'ELECTRONICS AND COMMUNICATION ENGINEERING',
      programme: user.programme || 'BE ECE',
      currentSemester: user.semester ? `Sem ${user.semester}` : 'Sem 3',
      className: user.className || 'II ECE',
      rollNo: user.rollNumber || '36',
      registerNo: user.registerNo || '420725106036',
      title: user.title || '',
      firstName: user.firstName || (user.name ? user.name.split(' ')[0] : 'RAJARAJAN'),
      lastName: user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : 'B'),
      dateOfBirth: user.dateOfBirth || '04-09-2008',
      gender: user.gender || 'Male',
      email: user.email || 'rajarajan2008@ckcet.ac.in',
      officialEmail: user.officialEmail || user.email || 'rajarajan2008@ckcet.ac.in',
      contactNumber: user.phone || '9994454494',
      whatsappNumber: user.whatsappNumber || user.phone || '9994454494',
      religious: user.religion || 'Hindu',
      communalCategory: user.communalCategory || 'MBC',
      bloodGroup: user.bloodGroup || 'O+VE',
      country: user.country || '',
      state: user.state || '',
      district: user.district || '',
      cityVillage: user.cityVillage || '',
      address: user.address || '18, DURGA NAGAR, MANAKUPPAM, PACHCHYAKUPPAM, CUDDALORE',
      streetArea: user.streetArea || '',
      pinCode: user.pinCode || '',
      motherTongue: user.motherTongue || '',
      nationality: user.nationality || ''
    });
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const semNum = parseInt(formData.currentSemester.replace(/\D/g, ''), 10) || 3;

    const updatedUser: User = {
      ...user,
      name: fullName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      officialEmail: formData.officialEmail,
      department: formData.department,
      programme: formData.programme,
      className: formData.className,
      academicSession: formData.academicSession,
      semester: semNum,
      rollNumber: formData.rollNo,
      registerNo: formData.registerNo,
      title: formData.title,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      phone: formData.contactNumber,
      whatsappNumber: formData.whatsappNumber,
      religion: formData.religious,
      communalCategory: formData.communalCategory,
      bloodGroup: formData.bloodGroup,
      country: formData.country,
      state: formData.state,
      district: formData.district,
      cityVillage: formData.cityVillage,
      address: formData.address,
      streetArea: formData.streetArea,
      pinCode: formData.pinCode,
      motherTongue: formData.motherTongue,
      nationality: formData.nationality
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Basic Info
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official academic registration, personal identity, and contact address details
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Basic Info Updated!
            </span>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Info</span>
          </button>
        </div>
      </div>

      {/* Form Fields Grid */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-4">
          
          {/* Row 1 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Academic Session
            </label>
            <input
              type="text"
              value={formData.academicSession}
              onChange={(e) => handleChange('academicSession', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          {/* Row 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Programme
            </label>
            <input
              type="text"
              value={formData.programme}
              onChange={(e) => handleChange('programme', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Current Semester:
            </label>
            <input
              type="text"
              value={formData.currentSemester}
              onChange={(e) => handleChange('currentSemester', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          {/* Row 3 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Class
            </label>
            <input
              type="text"
              value={formData.className}
              onChange={(e) => handleChange('className', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Roll No:
            </label>
            <input
              type="text"
              value={formData.rollNo}
              onChange={(e) => handleChange('rollNo', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          {/* Row 4 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Register No:
            </label>
            <input
              type="text"
              value={formData.registerNo}
              onChange={(e) => handleChange('registerNo', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              placeholder="Enter your Title"
              onChange={(e) => handleChange('title', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          {/* Row 5 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              First Name:
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Last Name:
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          {/* Row 6 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Date of Birth:
            </label>
            <input
              type="text"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Gender:
            </label>
            <div className="flex-1 w-full flex items-center gap-6 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80">
              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                Male
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                Female
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="gender"
                  value="Others"
                  checked={formData.gender === 'Others'}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                Others
              </label>
            </div>
          </div>

          {/* Row 7 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Email ID:
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Official Email ID:
            </label>
            <input
              type="email"
              value={formData.officialEmail}
              onChange={(e) => handleChange('officialEmail', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          {/* Row 8 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Contact Number:
            </label>
            <input
              type="text"
              value={formData.contactNumber}
              onChange={(e) => handleChange('contactNumber', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              WhatsApp Number:
            </label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          {/* Row 9 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Religious:
            </label>
            <input
              type="text"
              value={formData.religious}
              onChange={(e) => handleChange('religious', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Communal Category:
            </label>
            <input
              type="text"
              value={formData.communalCategory}
              onChange={(e) => handleChange('communalCategory', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          {/* Row 10 - Blood Group & Country */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Blood Group:
            </label>
            <input
              type="text"
              value={formData.bloodGroup}
              onChange={(e) => handleChange('bloodGroup', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Country
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            >
              <option value="">Select Your Country</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Singapore">Singapore</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
            </select>
          </div>

          {/* Row 11 - State & District */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              State
            </label>
            <select
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            >
              <option value="">Select Your State</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Kerala">Kerala</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              District
            </label>
            <select
              value={formData.district}
              onChange={(e) => handleChange('district', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            >
              <option value="">Select Your District</option>
              <option value="Cuddalore">Cuddalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Madurai">Madurai</option>
              <option value="Salem">Salem</option>
              <option value="Tiruchirappalli">Tiruchirappalli</option>
              <option value="Puducherry">Puducherry</option>
            </select>
          </div>

          {/* Row 12 - City/Village & Address */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              City/Village:
            </label>
            <input
              type="text"
              value={formData.cityVillage}
              placeholder="Enter Your City/Village"
              onChange={(e) => handleChange('cityVillage', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0 pt-2.5">
              Address:
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="flex-1 w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs resize-y"
            />
          </div>

          {/* Row 13 - Street/Area & Pin Code */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Street/Area
            </label>
            <input
              type="text"
              value={formData.streetArea}
              placeholder="Enter your Street/Area"
              onChange={(e) => handleChange('streetArea', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Pin Code
            </label>
            <input
              type="text"
              value={formData.pinCode}
              placeholder="Enter Your Pin Code"
              onChange={(e) => handleChange('pinCode', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          {/* Row 14 - Mother Tongue & Nationality */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Mother Tonque
            </label>
            <input
              type="text"
              value={formData.motherTongue}
              placeholder="Enter Your mother tonque"
              onChange={(e) => handleChange('motherTongue', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-44 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
              Nationality:
            </label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) => handleChange('nationality', e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition shadow-2xs"
            />
          </div>

        </div>
      </form>
    </div>
  );
};
