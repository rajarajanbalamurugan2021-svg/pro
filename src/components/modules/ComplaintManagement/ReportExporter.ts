import { Complaint } from '../../../types';

export class ReportExporter {
  // Export as CSV file
  static exportToCSV(complaints: Complaint[], filename = 'Complaint_Report.csv') {
    const headers = [
      'Complaint ID',
      'Title',
      'Category',
      'Priority',
      'Status',
      'Student Name',
      'Department',
      'Block',
      'Floor',
      'Room',
      'Assigned Staff',
      'Created At',
      'Resolved At',
      'Rating',
      'Feedback'
    ];

    const rows = complaints.map((c) => [
      `"${c.id}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.category}"`,
      `"${c.priority}"`,
      `"${c.status}"`,
      `"${c.studentName}"`,
      `"${c.department}"`,
      `"${c.blockName || 'N/A'}"`,
      `"${c.floor || 'N/A'}"`,
      `"${c.roomNumber || 'N/A'}"`,
      `"${c.assignedStaffName || 'Unassigned'}"`,
      `"${c.createdAt}"`,
      `"${c.resolvedAt || 'N/A'}"`,
      `"${c.rating || 'N/A'}"`,
      `"${(c.feedback || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Export as Excel compatible file (.xls format)
  static exportToExcel(complaints: Complaint[], filename = 'Complaint_Report.xls') {
    let tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"/><style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
        th { background-color: #1e293b; color: white; border: 1px solid #334155; padding: 8px; text-align: left; }
        td { border: 1px solid #cbd5e1; padding: 8px; }
        tr:nth-child(even) { background-color: #f8fafc; }
      </style></head>
      <body>
        <h2>CKCET CAMPRO - Complaint Management System Report</h2>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Student Name</th>
              <th>Department</th>
              <th>Block & Room</th>
              <th>Assigned Staff</th>
              <th>Created At</th>
              <th>Resolved At</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
    `;

    complaints.forEach((c) => {
      tableHtml += `
        <tr>
          <td>${c.id}</td>
          <td>${c.title}</td>
          <td>${c.category}</td>
          <td>${c.priority}</td>
          <td>${c.status}</td>
          <td>${c.studentName}</td>
          <td>${c.department}</td>
          <td>${c.blockName || ''} - ${c.floor || ''} (${c.roomNumber || ''})</td>
          <td>${c.assignedStaffName || 'Unassigned'}</td>
          <td>${c.createdAt}</td>
          <td>${c.resolvedAt || '-'}</td>
          <td>${c.rating ? c.rating + ' ★' : '-'}</td>
        </tr>
      `;
    });

    tableHtml += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Export printable PDF report
  static exportToPDF(complaints: Complaint[], title = 'CKCET Campus Complaint Summary Report') {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF reports.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; margin: 20px; color: #0f172a; }
          .header { border-bottom: 3px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .logo { font-size: 20px; font-weight: 800; color: #1e40af; }
          .title { font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
          .meta { font-size: 12px; color: #64748b; margin-top: 4px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
          .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; }
          .stat-num { font-size: 20px; font-weight: 800; color: #1e293b; }
          .stat-lbl { font-size: 11px; color: #64748b; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
          th { background-color: #1e293b; color: white; padding: 8px 10px; text-align: left; }
          td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
          .badge-high { background: #fee2e2; color: #991b1b; }
          .badge-medium { background: #fef3c7; color: #92400e; }
          .badge-low { background: #dcfce7; color: #166534; }
          .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; pt: 10px; font-size: 10px; color: #94a3b8; text-align: center; }
          @media print {
            body { margin: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">CKCET CAMPRO</div>
            <div class="title">${title}</div>
            <div class="meta">Generated: ${new Date().toLocaleString()} | Total Records: ${complaints.length}</div>
          </div>
          <button onclick="window.print()" style="padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
            Print / Save as PDF
          </button>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-num">${complaints.length}</div>
            <div class="stat-lbl">TOTAL COMPLAINTS</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">${complaints.filter(c => c.status === 'Pending' || c.status === 'New Complaint').length}</div>
            <div class="stat-lbl">PENDING / NEW</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">${complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length}</div>
            <div class="stat-lbl">IN PROGRESS</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">${complaints.filter(c => c.status === 'Resolved' || c.status === 'Approved' || c.status === 'Completed').length}</div>
            <div class="stat-lbl">RESOLVED / COMPLETED</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Complaint & Category</th>
              <th>Location</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Student</th>
              <th>Assigned Staff</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${complaints
              .map(
                (c) => `
              <tr>
                <td><strong>${c.id}</strong></td>
                <td>
                  <strong>${c.title}</strong><br/>
                  <span style="color: #64748b;">${c.category}</span>
                </td>
                <td>${c.blockName || 'Main'} ${c.floor ? '- ' + c.floor : ''} (${c.roomNumber || 'Room'})</td>
                <td><span class="badge badge-${c.priority.toLowerCase()}">${c.priority}</span></td>
                <td><strong>${c.status}</strong></td>
                <td>${c.studentName}<br/><span style="color: #64748b;">${c.department}</span></td>
                <td>${c.assignedStaffName || 'Unassigned'}</td>
                <td>${c.createdAt}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          This document is electronically generated by CKCET CAMPRO AI Grievance System. Confidential.
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
