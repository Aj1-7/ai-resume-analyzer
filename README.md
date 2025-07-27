# ⚡ AI Resume Analyzer

[![Vercel Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://ai-resume-analyzer-fqhos0ymy-arjuns-projects-64ae235f.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Aj1--7-blue?style=for-the-badge&logo=github)](https://github.com/Aj1-7/ai-resume-analyzer)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> **AI-powered resume optimization tool** that analyzes resumes, extracts job details, and provides instant ATS feedback—all in a modern dark UI.

---

## ✨ Features

### 🚀 **Smart Job Information Extraction**
- Paste a **job posting URL** → Instantly extracts:
  - ✅ Company Name
  - ✅ Job Title
  - ✅ Full Job Description
  - ✅ Location & Key Requirements (if available)
- Supports **LinkedIn, Indeed, Glassdoor, Monster, and more**
- Manual input fallback  
- Built with **Puppeteer + Cheerio** scraping

### 🎯 **AI-Powered Resume Analysis**
- Get **ATS compatibility score**
- Personalized suggestions for each section
- Visual scoring: Circular charts & gauge meters
- Quick feedback → Faster resume improvements

### 🎨 **Modern Dark UI**
- Glassmorphism + 3D floating cards
- Smooth **60fps animations**
- Fully responsive → Mobile & desktop friendly
- Optimized for speed & low latency

---

## 🖼️ Screenshots (Coming Soon)

| Dashboard | Resume Analysis | Job Extraction |
|-----------|---------------|---------------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Analysis](docs/screenshots/analysis.png) | ![Job Extraction](docs/screenshots/job.png) |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Aj1-7/ai-resume-analyzer.git
cd ai-resume-analyzer

# Install dependencies
npm install

# Run locally
npm run dev
