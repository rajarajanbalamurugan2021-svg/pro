/**
 * Utility functions for exporting Placement & Internship data to CSV, Excel, and PDF
 */

export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0]);
  const csvContent = [
    keys.join(','),
    ...rows.map(row =>
      keys.map(key => {
        let val = row[key];
        if (typeof val === 'object') val = JSON.stringify(val);
        const str = String(val ?? '').replace(/"/g, '""');
        return `"${str}"`;
      }).join(',')
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

export function exportToExcel(filename: string, rows: Record<string, any>[]) {
  // Generates Excel-friendly CSV with BOM for UTF-8 compatibility
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0]);
  const csvContent = '\uFEFF' + [
    keys.join(','),
    ...rows.map(row =>
      keys.map(key => {
        let val = row[key];
        if (Array.isArray(val)) val = val.join('; ');
        else if (typeof val === 'object') val = JSON.stringify(val);
        const str = String(val ?? '').replace(/"/g, '""');
        return `"${str}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(title: string, dataHeaders: string[], dataRows: string[][]) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #1e293b; }
          h1 { color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-bottom: 4px; }
          .meta { color: #64748b; font-size: 13px; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 10px 12px; font-size: 13px; border: 1px solid #cbd5e1; }
          td { padding: 9px 12px; font-size: 12px; border: 1px solid #e2e8f0; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer { margin-top: 32px; font-size: 11px; text-align: center; color: #94a3b8; }
        </style>
      </head>
      <body>
        <h1>CKCET CAMPRO - ${title}</h1>
        <div class="meta">Generated on: ${new Date().toLocaleString()} | Training & Placement Cell</div>
        <table>
          <thead>
            <tr>
              ${dataHeaders.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${dataRows.map(row => `<tr>${row.map(cell => `<td>${cell || '-'}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        <div class="footer">Confidential Report • CKCET Training & Placement Portal</div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
