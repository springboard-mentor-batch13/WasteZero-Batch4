export const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export const rowsToCsv = (headers, rows) => [
  headers.map(csvCell).join(','),
  ...rows.map((row) => row.map(csvCell).join(',')),
].join('\n');
