# Playwright_mcp

## EventHub login scenario

Copy `.env.example` to `.env` and set `EVENTHUB_USERNAME` and
`EVENTHUB_PASSWORD`. The local `.env` file is ignored by Git.

Run the EventHub login scenario with:

```sh
npm run local_runner
```

The run generates and opens a dashboard-style Cucumber HTML report with pass
charts at `reports/cucumber.html`. Use `npm run test:bdd` to include all
Cucumber scenarios.

