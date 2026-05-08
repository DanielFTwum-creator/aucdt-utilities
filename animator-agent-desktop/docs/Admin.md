# Admin Guide

## Overview

The `/admin` routes in the Animator Agent are protected by an authentication wall. Accessing these panels gives administrators access to critical diagnostic data and the testing suite.

## Routes
- `/admin/dashboard`: Monitors system vitals including the React version, testing tool status, and gap analysis results.
- `/admin/testing`: Interfaces with Puppeteer integration for rendering tests and automated WCAG accessibility audits.

## Authentication
Currently, the admin portal can be accessed using the static password `admin`. In production, this should be superseded by an OAuth or token-based backend mechanism.
