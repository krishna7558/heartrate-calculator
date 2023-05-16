const fs = require('fs');

// Read the input file
const inputFile = fs.readFileSync('heartrate.json');
const measurements = JSON.parse(inputFile);

// Group the measurements by date
const measurementsByDate = {};
measurements.forEach((measurement) => {
  const date = measurement.timestamps.startTime.slice(0, 10);
  if (!measurementsByDate[date]) {
    measurementsByDate[date] = [];
  }
  measurementsByDate[date].push(measurement);
});

// Calculate statistics for each day
const statsByDate = [];
for (const date in measurementsByDate) {
  const measurements = measurementsByDate[date];
  const beatsPerMinute = measurements.map((measurement) => measurement.beatsPerMinute);
  const min = Math.min(...beatsPerMinute);
  const max = Math.max(...beatsPerMinute);
  const median = calculateMedian(beatsPerMinute);
  const latestDataTimestamp = measurements[measurements.length - 1].timestamps.endTime;
  statsByDate.push({ date, min, max, median, latestDataTimestamp });
}

// Write the output file
const outputFile = 'output.json';
fs.writeFileSync(outputFile, JSON.stringify(statsByDate, null, 2));

// Function to calculate the median
function calculateMedian(arr) {
  const sorted = arr.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
}