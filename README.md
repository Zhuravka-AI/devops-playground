# 🚀 DevOps Playground: Fullstack CI/CD Case Study

![Build Status](https://github.com/Zhuravka-AI/devops-playground/actions/workflows/ci.yml/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Zhuravka-AI_devops-playground&metric=alert_status&token=c6b6f0f57088e823da4189a4c3ca3b0495f8428b)](https://sonarcloud.io/summary/new_code?id=Zhuravka-AI_devops-playground)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Zhuravka-AI_devops-playground&metric=coverage&token=c6b6f0f57088e823da4189a4c3ca3b0495f8428b)](https://sonarcloud.io/summary/new_code?id=Zhuravka-AI_devops-playground)

This project is a live demonstration of a modern **Software Development Life Cycle (SDLC)**. It features a Monorepo architecture with a FastAPI backend and React frontend, governed by a rigorous CI/CD pipeline.

---

## 🚀 Live Demo

* **Frontend (UI):** [https://project-frontend-latest-3oj0.onrender.com](https://project-frontend-latest-3oj0.onrender.com)
* **Backend (API Docs):** [https://project-backend-latest-jtvw.onrender.com/docs](https://project-backend-latest-jtvw.onrender.com/docs)

---

## 🛠 Technical Stack

* **Frontend:** React (Vite), Vitest, CSS3
* **Backend:** Python (FastAPI), Pytest, Docker
* **CI/CD:** GitHub Actions (Path-based filtering)
* **Analysis:** SonarCloud (Static Analysis & Coverage)
* **Monitoring:** Sentry (Real-time Error Tracking)
* **Hosting:** Render (Cloud PaaS)

---

## 🏗 System Architecture

The following diagram illustrates the interaction between services and the integrated monitoring layer:

```mermaid
graph TD
    %% App Architecture
    subgraph Architecture
        User((User Browser)) -->|React + Vite| FE_App[Frontend Container]
        FE_App -->|API Requests| BE_App[Backend Container - FastAPI]
        BE_App -->|Error Monitoring| Sentry[Sentry.io]
        FE_App -->|Error Monitoring| Sentry
    end

    %% Invisible link to force vertical layout
    Architecture ~~~ CI_CD_Pipeline

    %% CI/CD Flow
    subgraph CI_CD_Pipeline
        GH[GitHub Actions] -->|paths-filter| Filter{Detected Changes?}
        
        Filter -->|backend/**| BE_Test[backend-test]
        BE_Test --> BE_Sonar[SonarCloud Scan BE]
        BE_Sonar --> BE_Push[Docker Hub Push BE]
        BE_Push --> BE_Render[Render Deploy BE]
        
        Filter -->|frontend/**| FE_Test[frontend-test]
        FE_Test --> FE_Sonar[SonarCloud Scan FE]
        FE_Sonar --> FE_Push[Docker Hub Push FE]
        FE_Push --> FE_Render[Render Deploy FE]
    end

    style BE_Render fill:#f96,stroke:#333
    style FE_Render fill:#f96,stroke:#333
    style Sentry fill:#6e40aa,color:#fff
```

---

## ⚙️ CI/CD Pipeline Logic

The pipeline is optimized for speed and resource efficiency:

* **Selective Execution:** Uses `dorny/paths-filter`. If you only change Frontend code, the Backend tests and deployment are skipped.
* **Automated Quality Gate:** Deployment to production (`main` branch) is blocked if SonarCloud detects security vulnerabilities or if test coverage drops below the threshold.
* **Dockerized Builds:** Both services are containerized to ensure "it works on my machine" consistency in the cloud.
* **Traceability:** Every deployment is linked to a specific GitHub SHA and linked to Issues/PRs for full transparency.

---

## 📊 Monitoring & Quality

Keep track of the project's health and performance through these live dashboards:

* **🌐 Live Demo:** [View Website](https://project-frontend-latest.onrender.com)
* **🔍 SonarCloud Dashboard:** [Code Analysis Report](https://sonarcloud.io/dashboard?id=YOUR_PROJECT_KEY)
* **🛠 Sentry.io:** [Error Tracking Dashboard](https://sentry.io/organizations/your-org/projects/your-project/)

---

## 📦 Local Development

### Prerequisites

* Docker & Docker Compose

### Fast Start

```bash
# Clone the repository
git clone [https://github.com/YOUR_USERNAME/YOUR_REPO.git](https://github.com/YOUR_USERNAME/YOUR_REPO.git)

# Start the entire stack
docker-compose up --build
```

* **Frontend:** [http://localhost:80](http://localhost:80)
* **Backend:** [http://localhost:8000](http://localhost:8000)

---

## 📝 Project Management

This project follows a strict **Branching Strategy**:

* **main** - Production-ready code.
* **develop** - Integration branch for features.
* **feature/#-name** - Individual tasks linked to GitHub Issues.

*Example: Pull Requests containing "Closes #12" will automatically link and close the corresponding task upon merge.*
