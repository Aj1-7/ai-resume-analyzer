import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if(!blob) return;
            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        }

        loadResume();
    }, [imagePath]);

    return (
        <Link to={`/resume/${id}`} className="resume-card group animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-3 flex-1">
                    {companyName && (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                            <h2 className="!text-slate-100 font-bold break-words text-lg group-hover:text-primary transition-colors duration-300">{companyName}</h2>
                        </div>
                    )}
                    {jobTitle && (
                        <h3 className="text-base break-words text-slate-300 font-medium ml-4 group-hover:text-slate-200 transition-colors duration-300">{jobTitle}</h3>
                    )}
                    {!companyName && !jobTitle && (
                        <h2 className="!text-slate-100 font-bold text-lg group-hover:text-primary transition-colors duration-300">Resume</h2>
                    )}
                </div>
                <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            {resumeUrl && (
                <div className="gradient-border group-hover:scale-105 transition-all duration-500 relative overflow-hidden">
                    <div className="w-full h-full">
                        <img
                            src={resumeUrl}
                            alt="resume"
                            className="w-full h-[380px] max-sm:h-[240px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            )}
            <div className="flex items-center justify-between text-sm text-slate-300">
                <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View Details
                </span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    )
}
export default ResumeCard
