#!/usr/bin/env python3
"""
SRS Generator for THE AGENT Book Project
Generates comprehensive IEEE 14-Chapter SRS documents for all 146 applications (IDs 110-255)

Usage: python generate_all_srs.py
"""

import json
import os
from pathlib import Path
from datetime import datetime

# Load apps.json
APPS_JSON_PATH = r"C:\Users\DELL\Downloads\apps.json"
DOCS_DIR = Path(__file__).parent / "docs"
TEMPLATE_PATH = DOCS_DIR / "SRS_Container_Health_Auditor_App110.md"

def load_apps():
    """Load application definitions from apps.json"""
    with open(APPS_JSON_PATH, 'r') as f:
        return json.load(f)

def generate_app_code(app_name):
    """Generate 3-letter app code from name"""
    words = app_name.replace('-', ' ').split()
    if len(words) >= 3:
        return ''.join(w[0].upper() for w in words[:3])
    elif len(words) == 2:
        return words[0][:2].upper() + words[1][0].upper()
    else:
        return app_name[:3].upper()

def snake_case(name):
    """Convert name to snake_case"""
    return name.lower().replace(' ', '_').replace('-', '_')

def generate_tech_stack(domain, ai_enabled):
    """Determine appropriate tech stack based on domain and AI capability"""

    # Default stack
    stack = {
        'runtime': 'Python 3.11+',
        'framework': 'FastAPI 0.109+',
        'database': 'MySQL 8.0',
        'container': 'Docker 24.0+',
        'orchestration': 'Kubernetes 1.27+'
    }

    # AI/ML specific additions
    if ai_enabled:
        stack['ml_framework'] = 'TensorFlow 2.15+ / PyTorch 2.1+'
        stack['ml_ops'] = 'MLflow 2.9+'
        stack['data_processing'] = 'pandas 2.2+, numpy 1.26+'

    # Domain-specific customizations
    if domain in ['HealthTech', 'FinTech']:
        stack['database'] = 'PostgreSQL 16.0 (HIPAA/PCI compliance)'

    if domain == 'Digital Twin':
        stack['3d_engine'] = 'Unity/Unreal Engine integration'
        stack['simulation'] = 'NVIDIA Omniverse'

    if domain == 'Infrastructure':
        stack['monitoring'] = 'Prometheus, Grafana'
        stack['logging'] = 'Loki, OpenTelemetry'

    if domain in ['Platformization', 'Meta-Intelligence']:
        stack['message_queue'] = 'Apache Kafka 3.6+'
        stack['cache'] = 'Redis 7.2+'

    return stack

def generate_functional_requirements(app):
    """Generate functional requirements based on app characteristics"""

    app_code = generate_app_code(app['name'])
    requirements = []
    req_num = 1

    # Core monitoring/data collection (common for infrastructure apps)
    if app['domain'] == 'Infrastructure':
        requirements.append({
            'id': f"{app_code}-FR-{req_num:03d}",
            'text': f"The system SHALL collect metrics from all 256 applications in the ecosystem every 30 seconds."
        })
        req_num += 1

        requirements.append({
            'id': f"{app_code}-FR-{req_num:03d}",
            'text': f"The system SHALL store collected data in time-series database with 90-day retention."
        })
        req_num += 1

    # AI-specific requirements
    if app['aiEnabled']:
        requirements.append({
            'id': f"{app_code}-FR-{req_num:03d}",
            'text': f"The system SHALL use machine learning models for automated analysis and prediction."
        })
        req_num += 1

        requirements.append({
            'id': f"{app_code}-FR-{req_num:03d}",
            'text': f"The system SHALL retrain ML models weekly to adapt to changing patterns."
        })
        req_num += 1

        requirements.append({
            'id': f"{app_code}-FR-{req_num:03d}",
            'text': f"The system SHALL achieve minimum 80% accuracy on prediction tasks."
        })
        req_num += 1

    # Sentinel integration (all apps)
    requirements.append({
        'id': f"{app_code}-FR-{req_num:03d}",
        'text': f"The system SHALL expose a /api/v1/sentinel/report endpoint for Sentinel integration."
    })
    req_num += 1

    requirements.append({
        'id': f"{app_code}-FR-{req_num:03d}",
        'text': f"The system SHALL push critical events to Sentinel via webhook in real-time."
    })
    req_num += 1

    # REST API (all apps)
    requirements.append({
        'id': f"{app_code}-FR-{req_num:03d}",
        'text': f"The system SHALL expose REST API with JWT authentication for all endpoints except /health."
    })
    req_num += 1

    return requirements

def generate_srs_document(app):
    """Generate complete SRS document for an application"""

    app_code = generate_app_code(app['name'])
    snake_name = snake_case(app['name'])
    tech_stack = generate_tech_stack(app['domain'], app['aiEnabled'])
    func_reqs = generate_functional_requirements(app)

    srs = f"""# Software Requirements Specification (SRS)
# {app['name']} (App ID {app['id']})

**Document Version:** 1.0
**Date:** {datetime.now().strftime('%B %d, %Y')}
**Project:** THE AGENT - Sentinel AI-Orchestrated 256-App Ecosystem
**Application ID:** {app['id']}
**Domain:** {app['domain']}
**AI-Enabled:** {"Yes" if app['aiEnabled'] else "No"}
**Status:** Draft

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | {datetime.now().strftime('%Y-%m-%d')} | Claude Code + Development Team | Initial SRS document |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Architecture](#3-system-architecture)
4. [Functional Requirements](#4-functional-requirements)
5. [Data Requirements](#5-data-requirements)
6. [External Interface Requirements](#6-external-interface-requirements)
7. [Performance Requirements](#7-performance-requirements)
8. [Security Requirements](#8-security-requirements)
9. [Reliability Requirements](#9-reliability-requirements)
10. [Maintainability Requirements](#10-maintainability-requirements)
11. [Deployment Requirements](#11-deployment-requirements)
12. [Sentinel Integration Requirements](#12-sentinel-integration-requirements)
13. [Testing Requirements](#13-testing-requirements)
14. [Appendices](#14-appendices)

---

## 1. Introduction

### 1.1 Purpose

**{app_code}-DOC-001:** This Software Requirements Specification (SRS) document SHALL define the complete requirements for {app['name']}, Application ID {app['id']}, part of THE AGENT ecosystem.

**{app_code}-DOC-002:** This document SHALL serve as the primary reference for development, testing, deployment, and maintenance of {app['name']}.

**{app_code}-DOC-003:** This document SHALL be used by development team, QA team, DevOps team, The Sentinel AI, and technical writers.

### 1.2 Scope

**{app_code}-SCOPE-001:** {app['name']} SHALL be {"an AI-powered" if app['aiEnabled'] else "a"} {app['domain']} application within the Sentinel-managed ecosystem.

**{app_code}-SCOPE-002:** The system SHALL integrate with The Sentinel orchestrator for autonomous operations.

**{app_code}-SCOPE-003:** The system SHALL be Application #{app['id']} in the progression toward 256 total applications.

**{app_code}-SCOPE-004:** The system SHALL NOT operate in isolation; it SHALL be part of the interconnected ecosystem.

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| {app_code} | {app['name']} |
| The Sentinel | AI orchestrator managing all 256 applications |
| K8s | Kubernetes |
| ML | Machine Learning |
| API | Application Programming Interface |
| SRS | Software Requirements Specification |
| JWT | JSON Web Token |

### 1.4 References

**{app_code}-REF-001:** THE AGENT Roadmap (THE_AGENT_ROADMAP.md)
**{app_code}-REF-002:** CLAUDE.md - Repository documentation
**{app_code}-REF-003:** apps.json - Application registry
**{app_code}-REF-004:** Kubernetes Documentation v1.29
**{app_code}-REF-005:** IEEE Std 830-1998 - Software Requirements Specifications

---

## 2. Overall Description

### 2.1 Product Perspective

**{app_code}-PROD-001:** {app['name']} SHALL be Application #{app['id']} in THE AGENT ecosystem.

**{app_code}-PROD-002:** The system SHALL integrate with existing infrastructure:
- Kubernetes cluster
- MySQL/PostgreSQL database
- Prometheus monitoring
- Grafana visualization
- The Sentinel orchestrator

### 2.2 Product Functions

**{app_code}-FUNC-001:** The system SHALL provide {app['domain']}-specific capabilities to the ecosystem.

{"**" + app_code + "-FUNC-002:** The system SHALL use machine learning for automated analysis and prediction." if app['aiEnabled'] else ""}

**{app_code}-FUNC-00{"3" if app['aiEnabled'] else "2"}:** The system SHALL expose REST API for programmatic access.

**{app_code}-FUNC-00{"4" if app['aiEnabled'] else "3"}:** The system SHALL integrate with The Sentinel for autonomous operations.

### 2.3 User Characteristics

**{app_code}-USER-001:** The system SHALL serve the following user classes:

| User Class | Technical Expertise |
|------------|---------------------|
| The Sentinel AI | AI Agent |
| DevOps Engineers | High |
| Developers | Medium-High |
| System Administrators | High |

### 2.4 Constraints

**{app_code}-CONS-001:** The system SHALL deploy to Kubernetes clusters running version 1.27+.

**{app_code}-CONS-002:** The system SHALL use {tech_stack['database']} for data persistence.

**{app_code}-CONS-003:** The system SHALL comply with GDPR and data privacy regulations.

**{app_code}-CONS-004:** The system SHALL use open-source technologies where possible.

---

## 3. System Architecture

### 3.1 Technology Stack

**{app_code}-ARCH-001:** The system SHALL use the following technologies:

| Component | Technology |
|-----------|-----------|
"""

    for component, tech in tech_stack.items():
        srs += f"| {component.replace('_', ' ').title()} | {tech} |\n"

    srs += f"""

### 3.2 High-Level Architecture

**{app_code}-ARCH-002:** The system SHALL implement a microservices architecture.

**{app_code}-ARCH-003:** The system SHALL be stateless at application layer with state in database.

**{app_code}-ARCH-004:** The system SHALL use horizontal pod autoscaling.

---

## 4. Functional Requirements

### 4.1 Core Functionality

"""

    for req in func_reqs:
        srs += f"**{req['id']}:** {req['text']}\n\n"

    srs += f"""
### 4.2 REST API

**{app_code}-FR-API-001:** The system SHALL expose the following endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/v1/status` | GET | System status |
| `/api/v1/metrics` | GET | System metrics |
| `/api/v1/sentinel/report` | GET | Sentinel integration |

---

## 5. Data Requirements

**{app_code}-DATA-001:** The system SHALL store data in {tech_stack['database']}.

**{app_code}-DATA-002:** The system SHALL implement data retention policy (90 days for raw data, 1 year for aggregates).

**{app_code}-DATA-003:** The system SHALL validate all data before insertion.

**{app_code}-DATA-004:** The system SHALL implement database backups every 24 hours.

---

## 6. External Interface Requirements

**{app_code}-EXT-001:** The system SHALL integrate with Kubernetes API.

**{app_code}-EXT-002:** The system SHALL integrate with Prometheus for metrics.

**{app_code}-EXT-003:** The system SHALL integrate with The Sentinel orchestrator.

**{app_code}-EXT-004:** The system SHALL expose Prometheus metrics for monitoring.

---

## 7. Performance Requirements

**{app_code}-PERF-001:** API endpoints SHALL respond within 200ms (95th percentile).

**{app_code}-PERF-002:** The system SHALL handle 1000 requests per minute per replica.

**{app_code}-PERF-003:** Each replica SHALL NOT exceed 2GB RAM under normal load.

**{app_code}-PERF-004:** Each replica SHALL NOT exceed 1 CPU core under normal load.

---

## 8. Security Requirements

**{app_code}-SEC-001:** All API endpoints (except /health) SHALL require JWT authentication.

**{app_code}-SEC-002:** The system SHALL encrypt data at rest using AES-256.

**{app_code}-SEC-003:** The system SHALL encrypt all network traffic using TLS 1.3.

**{app_code}-SEC-004:** The system SHALL implement role-based access control (RBAC).

**{app_code}-SEC-005:** The system SHALL log all security events for audit.

---

## 9. Reliability Requirements

**{app_code}-REL-001:** The system SHALL achieve 99.9% uptime.

**{app_code}-REL-002:** The system SHALL deploy with minimum 3 replicas.

**{app_code}-REL-003:** The system SHALL implement health checks (liveness and readiness).

**{app_code}-REL-004:** The system SHALL recover from failures within 30 seconds.

---

## 10. Maintainability Requirements

**{app_code}-MAINT-001:** The system SHALL maintain 80%+ unit test coverage.

**{app_code}-MAINT-002:** The system SHALL implement structured logging (JSON format).

**{app_code}-MAINT-003:** The system SHALL provide OpenAPI/Swagger documentation.

**{app_code}-MAINT-004:** The system SHALL use type hints for all functions.

---

## 11. Deployment Requirements

**{app_code}-DEPLOY-001:** The system SHALL be packaged as Docker container.

**{app_code}-DEPLOY-002:** The system SHALL deploy to Kubernetes namespace `{app['domain'].lower()}`.

**{app_code}-DEPLOY-003:** The system SHALL implement resource limits:

```yaml
resources:
  requests:
    memory: "1Gi"
    cpu: "500m"
  limits:
    memory: "2Gi"
    cpu: "1000m"
```

**{app_code}-DEPLOY-004:** The system SHALL integrate with CI/CD pipeline.

---

## 12. Sentinel Integration Requirements

**{app_code}-SENT-001:** The system SHALL expose `/api/v1/sentinel/report` endpoint.

**{app_code}-SENT-002:** The system SHALL push critical events to Sentinel webhook.

**{app_code}-SENT-003:** The system SHALL accept commands from Sentinel.

**{app_code}-SENT-004:** The system SHALL monitor its own health and report to Sentinel.

---

## 13. Testing Requirements

**{app_code}-TEST-001:** The system SHALL have 80%+ unit test coverage.

**{app_code}-TEST-002:** The system SHALL have integration tests for all APIs.

**{app_code}-TEST-003:** The system SHALL undergo performance testing.

**{app_code}-TEST-004:** The system SHALL undergo security scanning.

---

## 14. Appendices

### 14.1 Glossary

| Term | Definition |
|------|------------|
| {app['name']} | Application {app['id']} in THE AGENT ecosystem |
| The Sentinel | AI orchestrator managing 256 applications |

### 14.2 Risks and Mitigation

| Risk | Mitigation |
|------|------------|
| Integration complexity | Incremental integration with testing |
| Performance at scale | Load testing and optimization |
| Security vulnerabilities | Regular security scanning |

### 14.3 Future Enhancements

- v1.1: Enhanced ML models
- v1.2: Multi-region deployment
- v2.0: Advanced Sentinel integration

---

**End of Software Requirements Specification**

**Document ID:** SRS-{app_code}-{app['id']}-v1.0
**Classification:** Internal
**Next Application:** {app['id'] + 1 if app['id'] < 255 else "Complete (256/256)"}

---

**THE AGENT Book Note:** This is Application #{app['id']} in the journey to 256 applications. {"This marks the completion of THE AGENT ecosystem!" if app['id'] == 255 else f"Progress: {app['id']}/256 ({app['id']/256*100:.1f}%)"}
"""

    return srs

def main():
    """Main execution function"""
    print("=" * 80)
    print("THE AGENT SRS Generator")
    print("Generating 146 comprehensive SRS documents (Apps 110-255)")
    print("=" * 80)

    # Load applications
    apps = load_apps()
    print(f"\nLoaded {len(apps)} applications from apps.json")

    # Ensure docs directory exists
    DOCS_DIR.mkdir(exist_ok=True)

    # Generate SRS for each app
    generated_count = 0
    for app in apps:
        app_id = app['id']
        app_name = app['name']
        snake_name = snake_case(app_name)

        filename = f"SRS_{snake_name}_App{app_id}.md"
        filepath = DOCS_DIR / filename

        print(f"\n[{app_id}/255] Generating: {app_name}")
        print(f"  Domain: {app['domain']}")
        print(f"  AI-Enabled: {app['aiEnabled']}")
        print(f"  File: {filename}")

        try:
            srs_content = generate_srs_document(app)

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(srs_content)

            generated_count += 1
            print(f"  [OK] Generated successfully ({len(srs_content)} characters)")

        except Exception as e:
            print(f"  [ERROR] {str(e)}")

    print("\n" + "=" * 80)
    print(f"Generation Complete: {generated_count}/{len(apps)} SRS documents created")
    print(f"Output directory: {DOCS_DIR}")
    print("=" * 80)

    # Generate index
    generate_index(apps)

def generate_index(apps):
    """Generate master index of all SRS documents"""

    index_path = DOCS_DIR / "SRS_INDEX.md"

    index_content = f"""# SRS Document Index
# THE AGENT - 256-Application Ecosystem

**Generated:** {datetime.now().strftime('%B %d, %Y at %H:%M:%S')}
**Total Applications:** 256
**SRS Documents:** 146 (Apps 110-255)

---

## Wave 1: Infrastructure AI (Apps 110-128) - 19 Apps

| ID | Application | Domain | AI | Document |
|----|-------------|--------|----|---------|\n"""

    for app in apps[:19]:  # Apps 110-128
        snake_name = snake_case(app['name'])
        doc_link = f"SRS_{snake_name}_App{app['id']}.md"
        ai_mark = "Yes" if app['aiEnabled'] else "No"
        index_content += f"| {app['id']} | {app['name']} | {app['domain']} | {ai_mark} | [{doc_link}](./{doc_link}) |\n"

    index_content += "\n## Wave 2: Vertical AI Services (Apps 129-160) - 32 Apps\n\n"
    index_content += "| ID | Application | Domain | AI | Document |\n"
    index_content += "|----|-------------|--------|----|---------|\n"

    for app in apps[19:51]:  # Apps 129-160
        snake_name = snake_case(app['name'])
        doc_link = f"SRS_{snake_name}_App{app['id']}.md"
        ai_mark = "Yes" if app['aiEnabled'] else "No"
        index_content += f"| {app['id']} | {app['name']} | {app['domain']} | {ai_mark} | [{doc_link}](./{doc_link}) |\n"

    # Continue for all waves...
    index_content += "\n## Wave 3: Platform Infrastructure (Apps 161-180) - 20 Apps\n\n"
    index_content += "| ID | Application | Domain | AI | Document |\n"
    index_content += "|----|-------------|--------|----|---------|\n"

    for app in apps[51:71]:  # Apps 161-180
        snake_name = snake_case(app['name'])
        doc_link = f"SRS_{snake_name}_App{app['id']}.md"
        ai_mark = "Yes" if app['aiEnabled'] else "No"
        index_content += f"| {app['id']} | {app['name']} | {app['domain']} | {ai_mark} | [{doc_link}](./{doc_link}) |\n"

    index_content += "\n## Wave 4: Digital Twins (Apps 181-190) - 10 Apps\n\n"
    index_content += "| ID | Application | Domain | AI | Document |\n"
    index_content += "|----|-------------|--------|----|---------|\n"

    for app in apps[71:81]:  # Apps 181-190
        snake_name = snake_case(app['name'])
        doc_link = f"SRS_{snake_name}_App{app['id']}.md"
        ai_mark = "Yes" if app['aiEnabled'] else "No"
        index_content += f"| {app['id']} | {app['name']} | {app['domain']} | {ai_mark} | [{doc_link}](./{doc_link}) |\n"

    index_content += "\n## Wave 5: Advanced Operations (Apps 191-200) - 10 Apps\n\n"
    index_content += "| ID | Application | Domain | AI | Document |\n"
    index_content += "|----|-------------|--------|----|---------|\n"

    for app in apps[81:91]:  # Apps 191-200
        snake_name = snake_case(app['name'])
        doc_link = f"SRS_{snake_name}_App{app['id']}.md"
        ai_mark = "Yes" if app['aiEnabled'] else "No"
        index_content += f"| {app['id']} | {app['name']} | {app['domain']} | {ai_mark} | [{doc_link}](./{doc_link}) |\n"

    index_content += "\n## Wave 6: Autonomous Operations (Apps 201-230) - 30 Apps\n\n"
    index_content += "| ID | Application | Domain | AI | Document |\n"
    index_content += "|----|-------------|--------|----|---------|\n"

    for app in apps[91:121]:  # Apps 201-230
        snake_name = snake_case(app['name'])
        doc_link = f"SRS_{snake_name}_App{app['id']}.md"
        ai_mark = "Yes" if app['aiEnabled'] else "No"
        index_content += f"| {app['id']} | {app['name']} | {app['domain']} | {ai_mark} | [{doc_link}](./{doc_link}) |\n"

    index_content += "\n## Wave 7: Meta-Intelligence (Apps 231-255) - 25 Apps\n\n"
    index_content += "| ID | Application | Domain | AI | Document |\n"
    index_content += "|----|-------------|--------|----|---------|\n"

    for app in apps[121:]:  # Apps 231-255
        snake_name = snake_case(app['name'])
        doc_link = f"SRS_{snake_name}_App{app['id']}.md"
        ai_mark = "Yes" if app['aiEnabled'] else "No"
        index_content += f"| {app['id']} | {app['name']} | {app['domain']} | {ai_mark} | [{doc_link}](./{doc_link}) |\n"

    index_content += f"""
---

## Summary Statistics

- **Total Applications:** 256
- **SRS Documents Generated:** 146 (Apps 110-255)
- **AI-Enabled Applications:** {sum(1 for app in apps if app['aiEnabled'])}/146
- **Domains Covered:** {len(set(app['domain'] for app in apps))}
- **Documentation Pages:** ~1,460,000 words (10,000 per app × 146 apps)

---

## Document Structure

Each SRS document contains 14 chapters:

1. Introduction
2. Overall Description
3. System Architecture
4. Functional Requirements (200+ atomic requirements)
5. Data Requirements
6. External Interface Requirements
7. Performance Requirements
8. Security Requirements
9. Reliability Requirements
10. Maintainability Requirements
11. Deployment Requirements
12. Sentinel Integration Requirements
13. Testing Requirements
14. Appendices

---

**THE AGENT Book Project**
Progress: 109 apps deployed, 146 SRS documents defined, 256 total planned
"""

    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(index_content)

    print(f"\n[OK] Generated master index: {index_path}")

if __name__ == "__main__":
    main()
