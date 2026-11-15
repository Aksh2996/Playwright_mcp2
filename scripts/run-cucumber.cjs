const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const reporter = require('cucumber-html-reporter');
const { chromium } = require('playwright');

const projectRoot = path.resolve(__dirname, '..');
const reportDirectory = path.join(projectRoot, 'reports');
const jsonReportPath = path.join(reportDirectory, 'cucumber.json');
const htmlReportPath = path.join(reportDirectory, 'cucumber.html');
const cucumberPackagePath = require.resolve('@cucumber/cucumber');
const cucumberPath = path.resolve(path.dirname(cucumberPackagePath), '..', 'bin', 'cucumber.js');

fs.mkdirSync(reportDirectory, { recursive: true });

const cucumber = spawn(
  process.execPath,
  [
    cucumberPath,
    ...process.argv.slice(2),
    '--format',
    'progress',
    '--format',
    'json:reports/cucumber.json',
  ],
  { cwd: projectRoot, stdio: 'inherit' },
);

cucumber.on('error', (error) => {
  console.error(`Failed to start Cucumber: ${error.message}`);
  process.exitCode = 1;
});

cucumber.on('close', (code) => {
  if (!fs.existsSync(jsonReportPath)) {
    console.error(`Cucumber did not generate the JSON report at ${jsonReportPath}`);
    process.exitCode = code ?? 1;
    return;
  }

  try {
    reporter.generate({
      theme: 'bootstrap',
      jsonFile: jsonReportPath,
      output: htmlReportPath,
      reportSuiteAsScenarios: true,
      scenarioTimestamp: true,
      launchReport: false,
      metadata: {
        Browser: 'Chromium',
        Platform: `${process.platform} ${process.arch}`,
        'Test Environment': process.env.NODE_ENV || 'Local',
      },
    });
  } catch (error) {
    console.error(`Failed to generate the Cucumber HTML report: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const browser = spawn(chromium.executablePath(), [pathToFileURL(htmlReportPath).href], {
    detached: true,
    stdio: 'ignore',
    windowsHide: false,
  });

  browser.on('error', (error) => {
    console.error(`Failed to open the Cucumber report in Chromium: ${error.message}`);
    process.exitCode = 1;
  });
  browser.on('spawn', () => {
    console.log(`Cucumber report opened in Chromium: ${htmlReportPath}`);
  });
  browser.unref();
  process.exitCode = code ?? 1;
});
