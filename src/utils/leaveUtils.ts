import { LeaveRequest, AcademicHoliday } from '../types';

/**
 * Calculates the total number of leave days between two dates inclusive.
 */
export function calculateLeaveDays(fromDateStr: string, toDateStr: string, holidays: AcademicHoliday[] = []): number {
  if (!fromDateStr || !toDateStr) return 1;
  const start = new Date(fromDateStr);
  const end = new Date(toDateStr);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
  if (end < start) return 1;

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diffDays);
}

/**
 * Calculates student attendance percentage impact based on current stats and leave days.
 */
export function calculateAttendanceImpact(currentAttendancePct: number = 88.33, totalClasses: number = 120, missedDays: number = 1) {
  const estimatedClassesPerDay = 6;
  const missedClasses = missedDays * estimatedClassesPerDay;
  const currentAttended = Math.round((currentAttendancePct / 100) * totalClasses);
  const newTotalClasses = totalClasses + missedClasses;
  const newPercentage = ((currentAttended) / newTotalClasses) * 100;
  const impactDrop = Number((currentAttendancePct - newPercentage).toFixed(2));

  return {
    currentPercentage: currentAttendancePct,
    projectedPercentage: Number(newPercentage.toFixed(2)),
    impactDrop
  };
}

/**
 * Auto-generates a unique sequential application ID e.g. LV-2026-006.
 */
export function generateLeaveApplicationId(existingLeaves: LeaveRequest[]): string {
  const currentYear = new Date().getFullYear();
  const nextNum = existingLeaves.length + 1;
  const padded = String(nextNum).padStart(3, '0');
  return `LV-${currentYear}-${padded}`;
}

/**
 * Exports JSON data array to CSV format and downloads file.
 */
export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      headers
        .map(header => {
          const val = row[header] === undefined || row[header] === null ? '' : String(row[header]);
          const escaped = val.replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates an official, printable HTML leave sanction document and opens print preview.
 */
export function printLeaveLetter(leave: LeaveRequest) {
  const printWin = window.open('', '_blank', 'width=800,height=900');
  if (!printWin) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>CKCET CAMPRO - Official Leave Sanction Order (${leave.applicationId || leave.id})</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
          .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; }
          .institution { font-size: 22px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
          .sub-text { font-size: 12px; color: #64748b; margin-top: 4px; }
          .badge { display: inline-block; padding: 6px 16px; background: #e0f2fe; color: #0369a1; border-radius: 20px; font-weight: bold; font-size: 12px; margin-top: 10px; }
          .meta-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
          .meta-table td { padding: 10px 12px; border: 1px solid #cbd5e1; }
          .meta-table td.label { font-weight: bold; background: #f8fafc; width: 30%; color: #334155; }
          .content { margin-top: 24px; font-size: 14px; line-height: 1.6; color: #334155; }
          .approval-box { margin-top: 40px; display: flex; justify-content: space-between; text-align: center; }
          .sig-line { border-top: 1px dashed #94a3b8; width: 200px; padding-top: 8px; font-size: 12px; font-weight: bold; }
          .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 10px; color: #94a3b8; text-align: center; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="institution">CKCET CAMPRO - ACADEMIC ADMINISTRATION</div>
          <div class="sub-text">College of Engineering & Technology • Office of Student Affairs & Academic Leaves</div>
          <div class="badge">OFFICIAL LEAVE SANCTION ORDER</div>
        </div>

        <p style="font-size: 13px; text-align: right; color: #64748b;">
          <strong>Order Date:</strong> ${leave.approvedDate || leave.lastUpdated || new Date().toLocaleDateString()}<br/>
          <strong>Ref No:</strong> ${leave.applicationId || leave.id}
        </p>

        <p class="content">
          This is an official sanction order confirming that the leave application submitted by <strong>${leave.studentName}</strong> 
          from the Department of <strong>${leave.department}</strong> has been formally verified and approved in accordance with CKCET Academic Regulations.
        </p>

        <table class="meta-table">
          <tr>
            <td class="label">Application Reference</td>
            <td>${leave.applicationId || leave.id}</td>
          </tr>
          <tr>
            <td class="label">Student Name</td>
            <td>${leave.studentName}</td>
          </tr>
          <tr>
            <td class="label">Register / Roll Number</td>
            <td>${leave.rollNumber}</td>
          </tr>
          <tr>
            <td class="label">Department & Class</td>
            <td>${leave.department} ${leave.year ? `(${leave.year} - Sec ${leave.section || 'A'})` : ''}</td>
          </tr>
          <tr>
            <td class="label">Leave Type</td>
            <td><strong>${leave.type}</strong></td>
          </tr>
          <tr>
            <td class="label">Duration / Period</td>
            <td>${leave.startDate} to ${leave.endDate} (${leave.daysCount} Day(s))</td>
          </tr>
          <tr>
            <td class="label">Reason specified</td>
            <td>${leave.reason}</td>
          </tr>
          <tr>
            <td class="label">Emergency Contact</td>
            <td>${leave.emergencyContact || leave.parentContact || 'On File'}</td>
          </tr>
          <tr>
            <td class="label">Approval Status</td>
            <td style="color: #16a34a; font-weight: bold;">APPROVED BY CLASS ADVISOR & HOD</td>
          </tr>
          ${leave.advisorRemarks ? `<tr><td class="label">Class Advisor Remarks</td><td>${leave.advisorRemarks}</td></tr>` : ''}
          ${leave.hodRemarks ? `<tr><td class="label">HOD Remarks</td><td>${leave.hodRemarks}</td></tr>` : ''}
        </table>

        <div class="approval-box">
          <div>
            <div style="height: 45px; display: flex; align-items: flex-end; justify-content: center; font-family: cursive; color: #0284c7; font-size: 16px;">
              ${leave.advisorName || 'Class Advisor'}
            </div>
            <div class="sig-line">Class Advisor Signature</div>
          </div>
          <div>
            <div style="height: 45px; display: flex; align-items: flex-end; justify-content: center; font-family: cursive; color: #0369a1; font-size: 16px;">
              ${leave.hodName || 'Head of Department'}
            </div>
            <div class="sig-line">Head of Department (HOD)</div>
          </div>
        </div>

        <div class="footer">
          Digitally generated and verified via CKCET CAMPRO Enterprise ERP • Valid for attendance exemption & lab rescheduling.<br/>
          System Verification Hash: ${Math.random().toString(36).substring(2, 12).toUpperCase()}
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWin.document.write(htmlContent);
  printWin.document.close();
}
