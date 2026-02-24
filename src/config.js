require('dotenv').config();

const config = {
  language: process.env.LANGUAGE || '',
  timeRange: process.env.TIME_RANGE || 'daily',
  outputFormat: process.env.OUTPUT_FORMAT || 'both',
  headless: process.env.HEADLESS !== 'false',
};

// Validate time range
const validTimeRanges = ['daily', 'weekly', 'monthly'];
if (!validTimeRanges.includes(config.timeRange)) {
  console.warn(`Invalid TIME_RANGE "${config.timeRange}". Defaulting to "daily".`);
  config.timeRange = 'daily';
}

// Validate output format
const validFormats = ['csv', 'json', 'both'];
if (!validFormats.includes(config.outputFormat)) {
  console.warn(`Invalid OUTPUT_FORMAT "${config.outputFormat}". Defaulting to "both".`);
  config.outputFormat = 'both';
}

module.exports = config;
