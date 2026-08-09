# Playwright E2E Test Suite for DevOps Playground

This E2E (End-to-End) test suite leverages **Playwright** with **TypeScript** to verify the entire system integration (Frontend, Backend, and Nginx reverse proxy) in a single workflow. 

It is designed with industrial best practices, utilizing the **Page Object Model (POM)** and **Custom Fixtures** patterns.

---

## 📂 Test Architecture & Directory Structure

To keep the codebase clean, modular, and decoupled from frontend or backend framework changes, the E2E tests live in a dedicated `/e2e` directory at the project root:

```text
e2e/
├── fixtures/
│   └── testFixtures.ts      # Custom extended Playwright fixtures (injects page objects automatically)
├── pages/
│   └── PlaygroundPage.ts    # Page Object Model (abstractions for locators & UI operations)
├── tests/
│   └── analytics.spec.ts    # Main E2E test suite covering core features & error handling
├── package.json             # Isolated node dependencies for testing
└── playwright.config.ts     # Playwright configuration (multi-browser, parallel runs, base URLs)
```

---

## 🧪 Key Test Scenarios Covered
The suite provides comprehensive coverage to verify integration without over-complicating:
1. **Component Rendering:** Verifies display headings, text areas, buttons, and state logic on initial load.
2. **Text Analysis (Short Content):** Simulates user typing, clicking analyze, and confirms exact output metrics from backend API.
3. **Text Analysis (Long Content):** Validates threshold categorization and appropriate CSS badges.
4. **Frontend Sentry Integration:** Checks that frontend error boundary trigger simulations function and output report status logs.
5. **Backend Sentry Integration:** Triggers the `/api/debug-sentry` endpoint to ensure server-side error handlers log and return a `500` status cleanly.

---

## 🚀 How to Run Locally

### 1. Run via Docker Compose (Recommended)
This mirrors exactly how the application runs in production and CI. It builds your changes and orchestrates your services behind Nginx, running your tests in an isolated, containerized environment with pre-baked browser engines:
```bash
# Start the backend, frontend, and nginx proxy with the 'test' profile
docker compose --profile test up -d --build backend frontend nginx

# Run the Playwright test suite inside its isolated Docker container (avoiding recreation of dependencies)
docker compose --profile test run --no-deps --rm e2e
```
That's it! Docker handles everything, and there's no need to download or install browsers on your local machine.

---

## 📦 Continuous Integration (CI) Workflow

The test suite is fully integrated into the GitHub Actions CI pipeline (`.github/workflows/ci.yml`).

Whenever a developer opens a Pull Request or pushes to `main`:
1. It uses `paths-filter` to detect changes to `frontend/**`, `backend/**`, or `e2e/**`.
2. It spins up a temporary Docker Compose cluster (`backend`, `frontend`, and `nginx`) inside the GitHub runner using `--profile test`.
3. It polls the backend API `/api/health` until it reports `ok`.
4. It executes the entire Playwright suite container (`docker compose --profile test run --no-deps --rm e2e`) in parallel across **Chromium**, **Firefox**, and **Webkit (Safari)**.
5. **Report Artifact Upload:** It automatically captures the `/app/playwright-report` output via volume mounts and uploads it as a workflow artifact named `playwright-report`.
6. It safely tears down Docker containers at the end.

---

## 🩺 Production Healthcheck / Smoke Testing (Post-Deploy)

One of the great advantages of an independent E2E directory is that it can run against **any** live deployment environment as a post-deploy healthcheck!

In your `.github/workflows/deploy.yml` pipeline, you can run the tests right inside their Docker container directly against your live staging/production servers:

```yaml
      - name: Run E2E Production Smoke Test
        run: |
          docker compose --profile test run \
            -e BASE_URL=https://your-production-app.com \
            --no-deps \
            --rm e2e
```

If the smoke test fails (e.g., due to a routing issue, database timeout, or configuration mismatch), the deployment step will immediately fail and alert you, allowing for rapid rollbacks.

### Also. Run via Dev Servers (Hot reloading)
If you are iteratively developing the frontend and backend locally:
```bash
# Run in the E2E folder, setting the BASE_URL to your local frontend port (usually http://localhost:5173)
cd e2e
npm install
npx playwright install

# Run tests
BASE_URL=http://localhost:80 npm test

# Open interactive UI mode (highly recommended for debugging!)
BASE_URL=http://localhost:80 npm run test:ui