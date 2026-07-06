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
This mirrors exactly how the application runs in production and CI. It compiles the local changes and orchestrates services behind Nginx:
```bash
# Start the backend, frontend, and nginx proxy
docker compose up -d --build

# Install Playwright dependencies
cd e2e
npm install
npx playwright install --with-deps

# Run the test suite against the Docker container (default is http://localhost)
npm test
```

### 2. Run via Dev Servers (Hot reloading)
If you are iteratively developing the frontend and backend locally:
```bash
# Run in the E2E folder, setting the BASE_URL to your local frontend port (usually http://localhost:5173)
cd e2e
npm install
npx playwright install

# Run tests
BASE_URL=http://localhost:5173 npm test

# Open interactive UI mode (highly recommended for debugging!)
BASE_URL=http://localhost:5173 npm run test:ui
```

---

## 📦 Continuous Integration (CI) Workflow

The test suite is fully integrated into the GitHub Actions CI pipeline (`.github/workflows/ci.yml`).

Whenever a developer opens a Pull Request or pushes to `main`:
1. It uses `paths-filter` to detect changes to `frontend/**`, `backend/**`, or `e2e/**`.
2. It spins up a temporary Docker Compose cluster directly inside the runner runner (`ubuntu-latest`).
3. It polls the backend API `/api/health` until it reports `ok`.
4. It executes the entire Playwright suite in parallel across **Chromium**, **Firefox**, and **Webkit (Safari)**.
5. It safely tears down Docker containers at the end.

This acts as a solid quality gateway, preventing any broken client/server contracts from being merged to `main`.

---

## 🩺 Production Healthcheck / Smoke Testing (Post-Deploy)

One of the great advantages of an independent E2E directory is that it can run against **any** live deployment environment as a post-deploy healthcheck!

In your `.github/workflows/deploy.yml` pipeline, you can run a final step right after your servers boot up:

```yaml
      - name: Run E2E Production Smoke Test
        env:
          BASE_URL: http://13.62.199.141 # Use your live environment URL or domain
        run: |
          cd e2e
          npm install
          npx playwright install --with-deps
          npm test
```

If the smoke test fails (e.g., if a networking issue, database timeout, or configuration mismatch occurs), the deployment step will immediately fail and alert you, allowing for rapid rollbacks.
