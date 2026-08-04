import React from 'react';
import { Complaint, UserRole, User } from '../../../types';
import { ComplaintManagementModule } from '../ComplaintManagement/ComplaintManagementModule';

interface ComplaintPortalProps {
  complaints: Complaint[];
  userRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  currentUser?: User | null;
  users?: User[];
  onAddComplaint: (complaint: Complaint) => void;
  onUpdateComplaintStatus: (id: string, status: Complaint['status'], assignedTo?: string) => void;
  onAddToast?: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert') => void;
}

export const ComplaintPortal: React.FC<ComplaintPortalProps> = ({
  complaints,
  userRole,
  currentUserId,
  currentUserName,
  currentUser,
  users,
  onAddComplaint,
  onUpdateComplaintStatus,
  onAddToast
}) => {
  const activeUser: User = currentUser || {
    id: currentUserId,
    name: currentUserName,
    email: 'user@university.edu',
    role: userRole,
    department: 'Computer Science & Engineering',
    phone: '+1 (555) 012-3456',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  };

  return (
    <ComplaintManagementModule
      complaints={complaints}
      userRole={userRole}
      currentUser={activeUser}
      users={users}
      onAddComplaint={onAddComplaint}
      onUpdateComplaintStatus={onUpdateComplaintStatus}
      onAddToast={onAddToast}
    />
  );
};
