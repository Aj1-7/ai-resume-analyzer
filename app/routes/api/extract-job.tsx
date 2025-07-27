import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

interface JobInfo {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  location?: string;
  salary?: string;
  requirements?: string[];
}

export async function action({ request }: { request: Request }) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Extracting job info from:', url);
    const jobInfo = await extractJobInfo(url);
    console.log('Extraction successful:', { companyName: jobInfo.companyName, jobTitle: jobInfo.jobTitle });
    
    return new Response(JSON.stringify(jobInfo), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Job extraction error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to extract job information',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function extractJobInfo(url: string): Promise<JobInfo> {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set user agent to avoid being blocked
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });
    
    console.log('Navigating to URL...');
    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('Extracting content...');
    // Get the page content
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // Extract job information based on the website
    const urlLower = url.toLowerCase();
    
    let jobInfo: JobInfo;
    
    if (urlLower.includes('linkedin.com')) {
      jobInfo = extractLinkedInJob($, url);
    } else if (urlLower.includes('indeed.com')) {
      jobInfo = extractIndeedJob($, url);
    } else if (urlLower.includes('glassdoor.com')) {
      jobInfo = extractGlassdoorJob($, url);
    } else if (urlLower.includes('monster.com')) {
      jobInfo = extractMonsterJob($, url);
    } else {
      // Generic extraction for other sites
      jobInfo = extractGenericJob($, url);
    }

    // Validate extracted data
    if (!jobInfo.companyName || jobInfo.companyName === 'Company') {
      jobInfo.companyName = extractCompanyFromUrl(url);
    }
    
    if (!jobInfo.jobTitle || jobInfo.jobTitle === 'Job Title') {
      jobInfo.jobTitle = extractJobTitleFromUrl(url);
    }

    return jobInfo;
  } catch (error) {
    console.error('Puppeteer error:', error);
    
    // Fallback to URL-based extraction if Puppeteer fails
    console.log('Falling back to URL-based extraction...');
    return {
      companyName: extractCompanyFromUrl(url),
      jobTitle: extractJobTitleFromUrl(url),
      jobDescription: `Job description could not be automatically extracted from ${url}. Please manually enter the job description for better analysis.`,
      location: '',
      requirements: []
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function extractLinkedInJob($: cheerio.CheerioAPI, url: string): JobInfo {
  // LinkedIn specific selectors
  const jobTitle = $('h1[class*="job-title"], h1[class*="title"], .job-details-jobs-unified-top-card__job-title, [data-test-id="job-details-jobs-unified-top-card__job-title"]').first().text().trim();
  const companyName = $('[class*="company-name"], [class*="employer"], .job-details-jobs-unified-top-card__company-name, [data-test-id="job-details-jobs-unified-top-card__company-name"]').first().text().trim();
  const location = $('[class*="location"], [class*="job-location"], .job-details-jobs-unified-top-card__bullet').first().text().trim();
  
  // Get job description
  let jobDescription = '';
  $('[class*="description"], [class*="job-description"], .jobs-description__content, [data-test-id="job-details-jobs-unified-top-card__job-description"]').each((_, el) => {
    jobDescription += $(el).text().trim() + '\n';
  });
  
  // Extract requirements
  const requirements: string[] = [];
  $('li, p').each((_, el) => {
    const text = $(el).text().trim();
    if (text.toLowerCase().includes('requirement') || text.toLowerCase().includes('qualification') || text.toLowerCase().includes('experience')) {
      requirements.push(text);
    }
  });

  return {
    companyName: companyName || extractCompanyFromUrl(url),
    jobTitle: jobTitle || extractJobTitleFromUrl(url),
    jobDescription: jobDescription.trim() || 'Job description extracted from LinkedIn. Please review and edit as needed.',
    location,
    requirements: requirements.slice(0, 5) // Limit to first 5 requirements
  };
}

function extractIndeedJob($: cheerio.CheerioAPI, url: string): JobInfo {
  // Indeed specific selectors
  const jobTitle = $('h1[class*="jobsearch-JobInfoHeader-title"], h1[class*="title"], [data-testid="jobsearch-JobInfoHeader-title"]').first().text().trim();
  const companyName = $('[class*="company"], [class*="employer"], [data-testid="jobsearch-JobInfoHeader-companyName"]').first().text().trim();
  const location = $('[class*="location"], [class*="job-location"], [data-testid="jobsearch-JobInfoHeader-locationText"]').first().text().trim();
  
  // Get job description
  let jobDescription = '';
  $('[class*="description"], [class*="job-description"], #jobDescriptionText, [data-testid="jobsearch-JobComponent-description"]').each((_, el) => {
    jobDescription += $(el).text().trim() + '\n';
  });

  return {
    companyName: companyName || extractCompanyFromUrl(url),
    jobTitle: jobTitle || extractJobTitleFromUrl(url),
    jobDescription: jobDescription.trim() || 'Job description extracted from Indeed. Please review and edit as needed.',
    location
  };
}

function extractGlassdoorJob($: cheerio.CheerioAPI, url: string): JobInfo {
  // Glassdoor specific selectors
  const jobTitle = $('h1[class*="job-title"], h1[class*="title"], [data-test="job-title"]').first().text().trim();
  const companyName = $('[class*="company"], [class*="employer"], [data-test="employer-name"]').first().text().trim();
  const location = $('[class*="location"], [class*="job-location"], [data-test="location"]').first().text().trim();
  
  // Get job description
  let jobDescription = '';
  $('[class*="description"], [class*="job-description"], .jobDescriptionContent, [data-test="job-description"]').each((_, el) => {
    jobDescription += $(el).text().trim() + '\n';
  });

  return {
    companyName: companyName || extractCompanyFromUrl(url),
    jobTitle: jobTitle || extractJobTitleFromUrl(url),
    jobDescription: jobDescription.trim() || 'Job description extracted from Glassdoor. Please review and edit as needed.',
    location
  };
}

function extractMonsterJob($: cheerio.CheerioAPI, url: string): JobInfo {
  // Monster specific selectors
  const jobTitle = $('h1[class*="job-title"], h1[class*="title"]').first().text().trim();
  const companyName = $('[class*="company"], [class*="employer"]').first().text().trim();
  const location = $('[class*="location"], [class*="job-location"]').first().text().trim();
  
  // Get job description
  let jobDescription = '';
  $('[class*="description"], [class*="job-description"]').each((_, el) => {
    jobDescription += $(el).text().trim() + '\n';
  });

  return {
    companyName: companyName || extractCompanyFromUrl(url),
    jobTitle: jobTitle || extractJobTitleFromUrl(url),
    jobDescription: jobDescription.trim() || 'Job description extracted from Monster. Please review and edit as needed.',
    location
  };
}

function extractGenericJob($: cheerio.CheerioAPI, url: string): JobInfo {
  // Generic selectors that work on most job sites
  const jobTitle = $('h1, h2, .title, [class*="title"]').first().text().trim();
  const companyName = $('[class*="company"], [class*="employer"], [class*="organization"]').first().text().trim();
  const location = $('[class*="location"], [class*="address"]').first().text().trim();
  
  // Get job description
  let jobDescription = '';
  $('p, div, section').each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 100 && text.length < 5000) { // Reasonable length for job description
      jobDescription += text + '\n';
    }
  });

  return {
    companyName: companyName || extractCompanyFromUrl(url),
    jobTitle: jobTitle || extractJobTitleFromUrl(url),
    jobDescription: jobDescription.trim() || 'Job description extracted from the provided URL. Please review and edit as needed.',
    location
  };
}

function extractCompanyFromUrl(url: string): string {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('linkedin.com')) {
    const match = url.match(/linkedin\.com\/jobs\/.*?at-([^\/-]+)/);
    return match ? match[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Company';
  }
  
  if (urlLower.includes('indeed.com')) {
    const match = url.match(/indeed\.com\/.*?at-([^\/-]+)/);
    return match ? match[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Company';
  }
  
  if (urlLower.includes('glassdoor.com')) {
    const match = url.match(/glassdoor\.com\/.*?at-([^\/-]+)/);
    return match ? match[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Company';
  }
  
  return 'Company';
}

function extractJobTitleFromUrl(url: string): string {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('linkedin.com')) {
    const match = url.match(/linkedin\.com\/jobs\/view\/([^\/-]+)/);
    return match ? match[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Job Title';
  }
  
  if (urlLower.includes('indeed.com')) {
    const match = url.match(/indeed\.com\/.*?job-([^\/-]+)/);
    return match ? match[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Job Title';
  }
  
  return 'Job Title';
} 