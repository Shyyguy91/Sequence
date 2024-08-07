// Google Sheets API setup (you'll need to replace with your actual credentials)
// ... (See Google Sheets API documentation for details)

const startNumberInput = document.getElementById('startNumber');
const endNumberInput = document.getElementById('endNumber');
const generateButton = document.getElementById('generateButton');
const statusDiv = document.getElementById('status');

generateButton.addEventListener('click', async () => {
  const start = parseInt(startNumberInput.value, 10);
  const end = parseInt(endNumberInput.value, 10);

  if (isNaN(start) || isNaN(end) || start > end) {
    statusDiv.textContent = "Invalid input. Please enter valid numbers.";
    return;
  }

  statusDiv.textContent = "Generating...";

  // Generate the number sequence (adjust for even distribution)
  const numbers = Array.from({ length: end - start + 1 }, (_, i) => i + start);
  numbers.sort(() => Math.random() - 0.5);

  // Split into chunks for each row
  const chunkSize = 42; // Number of columns
  const rows = [];
  for (let i = 0; i < numbers.length; i += chunkSize) {
    rows.push(numbers.slice(i, i + chunkSize));
  }

  try {
    // Create a new Google Sheet (you'll need to adjust this based on the API)
    const spreadsheet = await google.sheets('v4').spreadsheets.create({
      // ... (properties for the new sheet)
    });

    // Update the sheet with the rows of numbers
    await google.sheets('v4').spreadsheets.values.update({
      spreadsheetId: spreadsheet.spreadsheetId,
      range: 'Sheet1!A1:AQ12', // Assuming 12 rows
      valueInputOption: 'RAW',
      resource: { values: rows },
    });

    statusDiv.textContent = "Sheet generated successfully!";
    // Optionally, provide a link to the sheet
  } catch (error) {
    console.error("Error generating sheet:", error);
    statusDiv.textContent = "An error occurred while generating the sheet.";
  }
});
