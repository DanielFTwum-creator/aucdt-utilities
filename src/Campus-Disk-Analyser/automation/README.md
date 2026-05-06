# Lab Automation - Automated Disk Analysis System

## Overview
Comprehensive automation solution for regular disk analysis monitoring across Windows and macOS lab systems with centralized reporting and alerting.

## Components
- **Windows Automation**: Task Scheduler integration with PowerShell wrappers
- **macOS Automation**: Cron-based scheduling with native bash scripts
- **Central Collection**: Network-based data aggregation and reporting
- **Monitoring & Alerting**: Health checks and notification system
- **Web Dashboard**: Automated report generation and visualization

## Quick Start
1. Run platform-specific installation script
2. Configure central collection settings
3. Deploy across lab systems
4. Monitor via web dashboard

## Architecture
```
Lab Systems → Automated Scripts → Central Collection → Web Dashboard
     ↓              ↓                      ↓              ↓
Windows         Task Scheduler        Network Share    PowerDesk Web
macOS           Cron Jobs            Database         Reports & Alerts
```
