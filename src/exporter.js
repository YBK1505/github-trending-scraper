const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');

const OUTPUT_DIR = path.join(process.cwd(), 'output');

/**
 * Ensures the output directory exists.
 */
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

/**
 * Exports data to JSON file.
 * @param {Array} data - Array of repo objects
 */
function exportJSON(data) {
  ensureOutputDir();
  const filePath = path.join(OUTPUT_DIR, 'trending.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`  JSON saved to: ${filePath}`);
}

/**
 * Exports data to CSV file.
 * @param {Array} data - Array of repo objects
 */
function exportCSV(data) {
  ensureOutputDir();
  const fields = ['rank', 'author', 'name', 'fullName', 'url', 'description', 'language', 'stars', 'forks', 'starsToday'];
  const parser = new Parser({ fields });
  const csv = parser.parse(data);
  const filePath = path.join(OUTPUT_DIR, 'trending.csv');
  fs.writeFileSync(filePath, csv, 'utf8');
  console.log(`  CSV saved to: ${filePath}`);
}

/**
 * Exports data based on configured format.
 * @param {Array} data - Array of repo objects
 * @param {string} format - 'csv' | 'json' | 'both'
 */
function exportData(data, format) {
  console.log('\nExporting data...');
  if (format === 'json' || format === 'both') exportJSON(data);
  if (format === 'csv' || format === 'both') exportCSV(data);
}

module.exports = { exportData };
