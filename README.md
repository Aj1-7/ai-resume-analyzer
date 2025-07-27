
# AI Resume Analyzer

A modern, AI-powered resume analysis tool that provides instant feedback and optimization tips for job applications.

## Features

### 🚀 **Smart Job Information Extraction**
- **Auto-Extract Job Details**: Simply paste a job posting URL and our AI automatically extracts:
  - Company name
  - Job title
  - Full job description
  - Location (if available)
  - Key requirements (if available)
- **Supported Platforms**: LinkedIn, Indeed, Glassdoor, Monster, and most other job sites
- **Fallback System**: Manual input option always available
- **Real Web Scraping**: Uses Puppeteer for accurate data extraction

### 🎯 **AI-Powered Resume Analysis**
- **ATS Scoring**: Get your resume's ATS compatibility score
- **Personalized Feedback**: Receive specific improvement suggestions
- **Category Analysis**: Detailed breakdown of different resume sections
- **Visual Scoring**: Beautiful circular and gauge score displays

### 🎨 **Modern Dark UI**
- **3D Visual Effects**: Floating cards, depth shadows, and smooth animations
- **Glassmorphism Design**: Modern translucent elements with blur effects
- **Performance Optimized**: Hardware acceleration and smooth 60fps animations
- **Responsive Design**: Works perfectly on all devices

## Quick Start

### 1. **Upload Resume**
- Navigate to the upload page
- Choose between auto-extraction or manual input

### 2. **Job Information**
- **Option A**: Paste a job posting URL (LinkedIn, Indeed, etc.)
- **Option B**: Manually enter company name, job title, and description

### 3. **Get Analysis**
- Upload your resume (PDF format)
- Receive instant AI-powered feedback
- View detailed scores and improvement tips

## Technical Stack

- **Frontend**: React Router, TypeScript, Tailwind CSS
- **AI**: Puter AI for resume analysis
- **Web Scraping**: Puppeteer + Cheerio for job extraction
- **File Processing**: PDF.js for document handling
- **Styling**: Custom 3D effects and glassmorphism

## Installation

```bash
npm install
npm run dev
```

## Job Extraction API

The job extraction feature uses a server-side API endpoint at `/api/extract-job` that:

- **Scrapes Real Websites**: Uses Puppeteer to load and parse job pages
- **Smart Selectors**: Platform-specific CSS selectors for accurate extraction
- **Error Handling**: Graceful fallbacks if scraping fails
- **Rate Limiting**: Built-in delays to respect website policies

### Supported Job Sites
- ✅ LinkedIn Jobs
- ✅ Indeed
- ✅ Glassdoor
- ✅ Monster
- ✅ Generic job sites (with fallback extraction)

## Performance Features

- **Hardware Acceleration**: GPU-accelerated animations and transforms
- **Optimized Rendering**: Efficient CSS and minimal reflows
- **Smooth Interactions**: 60fps animations with proper easing
- **3D Effects**: Depth and perspective without performance impact

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own applications!