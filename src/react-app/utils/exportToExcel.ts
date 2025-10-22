import * as XLSX from 'xlsx';
import { BoardWithColumns } from '@/shared/types';

export function exportBoardToExcel(board: BoardWithColumns) {
  // Prepare data for Excel
  const data = [];
  
  for (const column of board.columns) {
    for (const task of column.tasks) {
      data.push({
        'Title': task.title,
        'Type': task.task_type || '',
        'City': task.city || '',
        'Assignee': '',
        'Requester Name': task.requester_name || '',
        'Requester Email': task.requester_email || '',
        'Status': column.name,
        'Created At': new Date(task.created_at).toLocaleString(),
        'Started At': '',
        'Completed At': '',
        'Duration': '',
        'Project Link': task.project_link || '',
        'Project Link 2': task.project_link_2 || ''
      });
    }
  }

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // Set column widths
  const columnWidths = [
    { wch: 30 }, // Title
    { wch: 20 }, // Type
    { wch: 15 }, // City
    { wch: 15 }, // Assignee
    { wch: 20 }, // Requester Name
    { wch: 25 }, // Requester Email
    { wch: 15 }, // Status
    { wch: 20 }, // Created At
    { wch: 20 }, // Started At
    { wch: 20 }, // Completed At
    { wch: 15 }, // Duration
    { wch: 30 }, // Project Link
    { wch: 30 }, // Project Link 2
  ];
  ws['!cols'] = columnWidths;

  // Apply autofilter
  if (data.length > 0) {
    ws['!autofilter'] = { ref: `A1:M${data.length + 1}` };
  }

  // Style the header row
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + '1';
    if (!ws[address]) continue;
    
    ws[address].s = {
      fill: {
        fgColor: { rgb: '006400' } // Dark green
      },
      font: {
        bold: true,
        color: { rgb: 'FFFFFF' } // White
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center'
      }
    };
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Tasks Report');

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${board.name.replace(/[^a-z0-9]/gi, '_')}_Report_${timestamp}.xlsx`;

  // Download the file
  XLSX.writeFile(wb, filename);
}
