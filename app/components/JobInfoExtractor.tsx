import { useState } from 'react';

interface JobInfo {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  location?: string;
  salary?: string;
  requirements?: string[];
}

interface JobInfoExtractorProps {
  onJobInfoExtracted: (jobInfo: JobInfo) => void;
  onManualInput: () => void;
}

const JobInfoExtractor = ({ onJobInfoExtracted, onManualInput }: JobInfoExtractorProps) => {
  const [jobUrl, setJobUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState('');

  const extractJobInfo = async () => {
    if (!jobUrl.trim()) {
      setError('Please enter a job URL');
      return;
    }

    setIsExtracting(true);
    setError('');

    try {
      // Call the real API endpoint
      const response = await fetch('/api/extract-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: jobUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      onJobInfoExtracted(data);
    } catch (err) {
      console.error('Extraction error:', err);
      setError(err instanceof Error ? err.message : 'Failed to extract job information. Please try manual input.');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="floating-card max-w-2xl w-full">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-100 mb-2">Auto-Extract Job Info</h3>
          <p className="text-slate-300 leading-relaxed">
            Paste a job posting URL and we'll automatically extract the company name, job title, and description for you.
          </p>
        </div>

        <div className="space-y-4">
          <div className="form-div">
            <label className="text-slate-200 font-medium">Job Posting URL</label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://linkedin.com/jobs/view/..."
              className="focus:ring-2 focus:ring-emerald-500/30"
            />
            <p className="text-xs text-slate-400 mt-1">
              Supports LinkedIn, Indeed, Glassdoor, Monster, and other major job sites
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={extractJobInfo}
              disabled={isExtracting || !jobUrl.trim()}
              className="flex-1 primary-button flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExtracting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>Extract Job Info</span>
                </>
              )}
            </button>
            
            <button
              onClick={onManualInput}
              className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/30 rounded-xl text-slate-200 font-medium transition-all duration-200 hover:scale-105"
            >
              Manual Input
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/20">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-slate-200 font-medium mb-1">How it works</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our AI analyzes the job posting URL and automatically extracts the company name, job title, and full job description. This saves you time and ensures accurate information for better resume analysis.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-slate-200 font-medium mb-1">Supported Sites</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                LinkedIn, Indeed, Glassdoor, Monster, and most other job posting websites. The extraction process takes about 10-15 seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobInfoExtractor; 