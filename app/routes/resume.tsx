import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [resumeData, setResumeData] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);
            setResumeData(data);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
            console.log({resumeUrl, imageUrl, feedback: data.feedback });
        }

        loadResume();
    }, [id]);

    return (
        <main className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
            <nav className="resume-nav">
                <Link to="/" className="back-button group">
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-dark-300 text-sm font-semibold">Back to Homepage</span>
                </Link>
                {resumeData && (
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            {resumeData.companyName && (
                                <h3 className="text-lg font-bold text-dark-300">{resumeData.companyName}</h3>
                            )}
                            {resumeData.jobTitle && (
                                <p className="text-sm text-dark-200">{resumeData.jobTitle}</p>
                            )}
                        </div>
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    </div>
                )}
            </nav>
            
            <div className="flex flex-row w-full max-lg:flex-col-reverse gap-8 p-6">
                <section className="feedback-section bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm rounded-2xl p-6 sticky top-6 h-fit">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90vh] max-wxl:h-fit w-fit overflow-hidden">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="block group">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500"
                                    title="resume"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </div>
                                </div>
                            </a>
                        </div>
                    )}
                </section>
                
                <section className="feedback-section flex-1">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-bold text-gradient">Resume Review</h2>
                    </div>
                    
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <div className="floating-card max-w-2xl w-full">
                            <div className="flex flex-col items-center justify-center gap-6 py-12">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-pulse">
                                    <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-dark-300">Loading resume analysis...</h3>
                                <img src="/images/resume-scan-2.gif" className="w-full max-w-md rounded-xl shadow-lg" />
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume
