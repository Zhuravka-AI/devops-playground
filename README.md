# 🚀 DevOps Playground: Fullstack CI/CD Case Study

![Build Status](https://github.com/Zhuravka-AI/devops-playground/actions/workflows/ci.yml/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Zhuravka-AI_devops-playground&metric=alert_status&token=c6b6f0f57088e823da4189a4c3ca3b0495f8428b)](https://sonarcloud.io/summary/new_code?id=Zhuravka-AI_devops-playground)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Zhuravka-AI_devops-playground&metric=coverage&token=c6b6f0f57088e823da4189a4c3ca3b0495f8428b)](https://sonarcloud.io/summary/new_code?id=Zhuravka-AI_devops-playground)
![Sentry Frontend](https://img.shields.io/badge/Sentry-Frontend-440154?style=flat-square&logo=sentry)
![Sentry Backend](https://img.shields.io/badge/Sentry-Backend-440154?style=flat-square&logo=sentry)


This project is a live demonstration of a modern **Software Development Life Cycle (SDLC)**. It features a Monorepo architecture with a FastAPI backend and React frontend, governed by a rigorous CI/CD pipeline.

---

## 🚀 Live Access

* **🌐 Main Application:** [http://ec2-51-21-45-71.eu-north-1.compute.amazonaws.com/](http://ec2-51-21-45-71.eu-north-1.compute.amazonaws.com/)
* **🌐 API Documentation:** [http://ec2-51-21-45-71.eu-north-1.compute.amazonaws.com/api/docs](http://ec2-51-21-45-71.eu-north-1.compute.amazonaws.com/api/docs)

---

## 🛠 Technical Stack

* **Frontend:** React (Vite), Vitest, CSS3
* **Backend:** Python (FastAPI), Pytest, Docker
* **Infrastructure:** AWS EC2 (t3.micro), Static Elastic IP (51.21.45.71)
* **Orchestration:** Docker Compose
* **CI/CD:** GitHub Actions (Path-based filtering) + Docker Hub + SSH Deploy
* **Analysis:** SonarCloud (Static Analysis & Coverage)
* **Monitoring:** Sentry (Real-time Error Tracking)

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

    Architecture ~~~ CI_CD

    %% CI/CD Flow
    subgraph CI_CD [CI/CD Workflow]
        direction TB
        GH[GitHub Actions CI] -->|Paths Filter| Filter_CI{Changes?}
        
        Filter_CI -->|backend| BE_Test[Backend Test & Sonar]
        Filter_CI -->|frontend| FE_Test[Frontend Test & Sonar]
        
        BE_Test & FE_Test -->|Trigger: workflow_run| CD[GitHub Actions CD: Deploy to AWS]
        
        subgraph CD_Pipeline [CD Pipeline]
            CD --> Build[Build & Push to DockerHub]
            Build --> SCP[Copy Compose & Configs via SCP]
            SCP --> SSH[Deploy via SSH: docker compose pull && up]
        end
    end

    style CD fill:#f96,stroke:#333
    style Build fill:#f96,stroke:#333
    style SSH fill:#f96,stroke:#333
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

* **🔍 SonarCloud Dashboard:** [Code Analysis Report](https://sonarcloud.io/dashboard?id=Zhuravka-AI_devops-playground)
* **🛠 Sentry.io:** [Error Tracking Dashboard](https://zhuravka-ai-es.sentry.io/dashboard/default-overview/)

---

## 📦 Local Development

### Prerequisites

* Docker & Docker Compose

### Fast Start

```bash
git clone https://github.com/Zhuravka-AI/devops-playground.git
cd devops-playground
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
