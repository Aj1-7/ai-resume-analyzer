import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import JobInfoExtractor from "~/components/JobInfoExtractor";
import FloatingCard3D from "~/components/FloatingCard3D";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [showManualForm, setShowManualForm] = useState(false);
    const [jobInfo, setJobInfo] = useState({
        companyName: '',
        jobTitle: '',
        jobDescription: '',
        location: '',
        salary: '',
        requirements: [] as string[]
    });

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleJobInfoExtracted = (extractedInfo: { 
        companyName: string, 
        jobTitle: string, 
        jobDescription: string,
        location?: string,
        salary?: string,
        requirements?: string[]
    }) => {
        setJobInfo({
            companyName: extractedInfo.companyName,
            jobTitle: extractedInfo.jobTitle,
            jobDescription: extractedInfo.jobDescription,
            location: extractedInfo.location || '',
            salary: extractedInfo.salary || '',
            requirements: extractedInfo.requirements || []
        });
        setShowManualForm(true);
    }

    const handleManualInput = () => {
        setShowManualForm(true);
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        )
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        console.log(data);
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <div className="flex items-center gap-6 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-7xl font-black leading-tight tracking-tight">Smart Resume Analysis</h1>
                            <p className="text-2xl text-slate-300 mt-2 font-medium">AI-Powered Feedback & Optimization</p>
                        </div>
                    </div>
                    {isProcessing ? (
                        <FloatingCard3D className="floating-card max-w-2xl w-full" intensity={0.1}>
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center animate-pulse">
                                    <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-slate-200">{statusText}</h2>
                                <img src="/images/resume-scan.gif" className="w-full max-w-md rounded-xl shadow-lg" />
                            </div>
                        </FloatingCard3D>
                    ) : (
                        <>
                            <h2 className="text-xl text-slate-400 max-w-3xl leading-relaxed">
                                Get instant AI-powered feedback on your resume. Upload your resume and job details to receive personalized optimization tips and ATS scoring.
                            </h2>
                            
                            {!showManualForm ? (
                                <JobInfoExtractor 
                                    onJobInfoExtracted={handleJobInfoExtracted}
                                    onManualInput={handleManualInput}
                                />
                            ) : (
                                <FloatingCard3D className="floating-card max-w-2xl w-full" intensity={0.12}>
                                    <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="form-div">
                                                <label htmlFor="company-name">Company Name</label>
                                                <input 
                                                    type="text" 
                                                    name="company-name" 
                                                    placeholder="Enter company name" 
                                                    id="company-name"
                                                    value={jobInfo.companyName}
                                                    onChange={(e) => setJobInfo({...jobInfo, companyName: e.target.value})}
                                                    className="focus:ring-2 focus:ring-emerald-500/30"
                                                />
                                            </div>
                                            <div className="form-div">
                                                <label htmlFor="job-title">Job Title</label>
                                                <input 
                                                    type="text" 
                                                    name="job-title" 
                                                    placeholder="Enter job title" 
                                                    id="job-title"
                                                    value={jobInfo.jobTitle}
                                                    onChange={(e) => setJobInfo({...jobInfo, jobTitle: e.target.value})}
                                                    className="focus:ring-2 focus:ring-emerald-500/30"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="form-div">
                                                <label htmlFor="location">Location</label>
                                                <input 
                                                    type="text" 
                                                    name="location" 
                                                    placeholder="Job location" 
                                                    id="location"
                                                    value={jobInfo.location}
                                                    onChange={(e) => setJobInfo({...jobInfo, location: e.target.value})}
                                                    className="focus:ring-2 focus:ring-emerald-500/30"
                                                />
                                            </div>
                                            <div className="form-div">
                                                <label htmlFor="salary">Salary (Optional)</label>
                                                <input 
                                                    type="text" 
                                                    name="salary" 
                                                    placeholder="Salary range" 
                                                    id="salary"
                                                    value={jobInfo.salary}
                                                    onChange={(e) => setJobInfo({...jobInfo, salary: e.target.value})}
                                                    className="focus:ring-2 focus:ring-emerald-500/30"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-div">
                                            <label htmlFor="job-description">Job Description</label>
                                            <textarea 
                                                rows={6} 
                                                name="job-description" 
                                                placeholder="Paste the job description here..." 
                                                id="job-description"
                                                value={jobInfo.jobDescription}
                                                onChange={(e) => setJobInfo({...jobInfo, jobDescription: e.target.value})}
                                                className="focus:ring-2 focus:ring-emerald-500/30 resize-none"
                                            />
                                        </div>

                                        {jobInfo.requirements && jobInfo.requirements.length > 0 && (
                                            <div className="form-div">
                                                <label>Key Requirements (Extracted)</label>
                                                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                                                    <ul className="space-y-2">
                                                        {jobInfo.requirements.map((req, index) => (
                                                            <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                                                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                                                                {req}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        <div className="form-div">
                                            <label>Upload Resume</label>
                                            <FileUploader onFileSelect={handleFileSelect} />
                                        </div>

                                        <div className="flex gap-3">
                                            <button 
                                                className="flex-1 primary-button flex items-center justify-center gap-2 group" 
                                                type="submit"
                                                disabled={!file}
                                            >
                                                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Analyze Resume
                                            </button>
                                            
                                            <button
                                                type="button"
                                                onClick={() => setShowManualForm(false)}
                                                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/30 rounded-xl text-slate-200 font-medium transition-all duration-200 hover:scale-105"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </form>
                                </FloatingCard3D>
                            )}
                        </>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
