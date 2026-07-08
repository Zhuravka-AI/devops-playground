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
# Start the backend, frontend, and nginx proxy
docker compose up -d --build backend frontend nginx

# Run the Playwright test suite inside its isolated Docker container
docker compose --profile test run --rm e2e
```
That's it! Docker handles everything, and there's no need to download or install browsers on your local machine.

---

## 🔍 Q&A: Ports, Networks, and Docker-Specifics

Here are clear answers to common questions regarding port mapping, networking inside Docker, and retrieving reports:

### Q1: Where does port 5173 come from in `BASE_URL=http://localhost:5173`? Why does `localhost:80` work instead?
* **Port 5173** is the default port used by **Vite** when you run a frontend development server locally (`npm run dev` directly within the `/frontend` directory).
* When you run the full stack via **Docker Compose**, **Nginx** acts as the gateway/reverse proxy on port `80` (standard HTTP), routing all incoming frontend requests to the containerized frontend server and `/api/*` requests to the FastAPI backend. 
* Therefore, when using the Docker orchestration, `http://localhost:80` (or simply `http://localhost`) is the correct entrypoint to test the unified app. Port `5173` is only relevant if you bypass Nginx and run the frontend dev server standalone.

### Q2: Why does `BASE_URL=http://nginx:80` not work for `docker compose run --rm e2e` initially, but `localhost:80` doesn't either?
Your browser launch crashed immediately with the error:
```text
Error: browserType.launch: Executable doesn't exist at /ms-playwright/chromium_headless_shell-1228/chrome-linux/headless_shell
Looks like Playwright was just updated to 1.61.1. Please update docker image as well.
```
* **The Root Cause:** In `e2e/package.json`, we previously defined Playwright with a caret `"^1.49.0"`. When building the docker image, npm resolved the caret to a newer patch release (e.g., `1.61.1`). Playwright then looked for browser binaries matching `1.61.1`. However, the base Docker image `mcr.microsoft.com/playwright:v1.49.0-noble` only comes pre-baked with browsers for `1.49.0`. This version mismatch caused the browser to fail to start entirely.
* **The Fix:** We have **pinned** Playwright to exactly `"1.49.0"` in `e2e/package.json`. Now, the dependency matches the pre-baked browsers in the Docker container perfectly, and the browser will launch smoothly.
* **Networking Context:** Once the browser starts successfully, `BASE_URL=http://nginx:80` (or `http://nginx`) is **exactly** what you need inside the docker network. Since the `e2e` container is running within the same Docker network, it cannot access the app via `localhost` (as `localhost` inside the container refers to the E2E container itself!). It must refer to the gateway service by its service name, which is `nginx`.

### Q3: How do I view HTML reports served at `http://localhost:9323` inside the Docker container?
By default, Docker containers are isolated. If Playwright starts a report server inside the container, you won't be able to access it from your browser on the host machine because the port is not forwarded.
* **The Fix:** We have updated `e2e/package.json` to bind the report server to all network interfaces (`0.0.0.0` instead of `127.0.0.1`) and added port `9323:9323` to the `e2e` service in `docker-compose.yml`.
* **To view reports, run:**
  ```bash
  # Start the report server inside the docker container, enabling service port mapping
  docker compose --profile test run --service-ports --rm e2e npm run test:report
  ```
  Now, you can open **`http://localhost:9323`** in your host machine's web browser and view your test reports with full trace logs!

---

## 📦 Continuous Integration (CI) Workflow

The test suite is fully integrated into the GitHub Actions CI pipeline (`.github/workflows/ci.yml`).

Whenever a developer opens a Pull Request or pushes to `main`:
1. It uses `paths-filter` to detect changes to `frontend/**`, `backend/**`, or `e2e/**`.
2. It spins up a temporary Docker Compose cluster (`backend`, `frontend`, and `nginx`) inside the GitHub runner.
3. It polls the backend API `/api/health` until it reports `ok`.
4. It executes the entire Playwright suite container (`docker compose --profile test run --rm e2e`) in parallel across **Chromium**, **Firefox**, and **Webkit (Safari)**.
5. It safely tears down Docker containers at the end.

This acts as a solid quality gateway, preventing any broken client/server contracts from being merged to `main`, without having to install any browsers or node packages on the GitHub Action host.

---

## 🩺 Production Healthcheck / Smoke Testing (Post-Deploy)

One of the great advantages of an independent E2E directory is that it can run against **any** live deployment environment as a post-deploy healthcheck!

In your `.github/workflows/deploy.yml` pipeline, you can run the tests right inside their Docker container directly against your live staging/production servers:

```yaml
      - name: Run E2E Production Smoke Test
        run: |
          docker compose --profile test run \
            -e BASE_URL=https://your-production-app.com \
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