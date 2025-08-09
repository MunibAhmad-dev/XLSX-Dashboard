export const printRecord = (record: any) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>User Record - ${record.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { border-bottom: 2px solid #3B82F6; margin-bottom: 20px; padding-bottom: 10px; }
          .field { margin: 10px 0; }
          .label { font-weight: bold; color: #374151; }
          .value { margin-left: 10px; }
          .notes { margin-top: 20px; padding: 15px; background: #F9FAFB; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>User Record</h1>
        </div>
        <div class="field">
          <span class="label">Name:</span>
          <span class="value">${record.name}</span>
        </div>
        <div class="field">
          <span class="label">Number:</span>
          <span class="value">${record.number}</span>
        </div>
        <div class="field">
          <span class="label">Email:</span>
          <span class="value">${record.email}</span>
        </div>
        <div class="field">
          <span class="label">CNIC:</span>
          <span class="value">${record.cnic}</span>
        </div>
        <div class="field">
          <span class="label">Hard Copy Given:</span>
          <span class="value">${record.hardCopyGiven ? 'Yes' : 'No'}</span>
        </div>
        <div class="field">
          <span class="label">Date Added:</span>
          <span class="value">${record.dateAdded}</span>
        </div>
        <div class="notes">
          <div class="label">Notes:</div>
          <div class="value">${record.notes || 'No notes available'}</div>
        </div>
      </body>
    </html>
  `;
  
  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
};