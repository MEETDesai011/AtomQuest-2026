const ExcelJS = require('exceljs');

async function buildAchievementReport(reportData, cycleName) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Goal Portal';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Achievement Report');

  sheet.columns = [
    { header: 'Employee Name', key: 'employeeName', width: 22 },
    { header: 'Department', key: 'department', width: 18 },
    { header: 'Thrust Area', key: 'thrustArea', width: 16 },
    { header: 'Goal Title', key: 'title', width: 30 },
    { header: 'UoM', key: 'uom', width: 12 },
    { header: 'Target', key: 'target', width: 12 },
    { header: 'Actual Achievement', key: 'actual', width: 20 },
    { header: 'Progress Score %', key: 'progressScore', width: 18 },
    { header: 'Status', key: 'status', width: 16 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F46E5' },
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

  for (const employee of reportData) {
    for (const goal of employee.goals) {
      sheet.addRow({
        employeeName: employee.employeeName,
        department: employee.department,
        thrustArea: goal.thrustArea,
        title: goal.title,
        uom: goal.uom,
        target: goal.target,
        actual: goal.actual ?? '—',
        progressScore: goal.progressScore != null ? `${goal.progressScore}%` : '—',
        status: goal.status,
      });
    }
  }

  sheet.columns.forEach((column) => {
    let maxLength = column.header.length;
    column.eachCell({ includeEmpty: false }, (cell) => {
      const cellLength = cell.value ? cell.value.toString().length : 0;
      if (cellLength > maxLength) maxLength = cellLength;
    });
    column.width = Math.min(maxLength + 4, 50);
  });

  return workbook;
}

module.exports = { buildAchievementReport };
