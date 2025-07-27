import { useEffect, useState } from 'react';
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import FloatingCard3D from "~/components/FloatingCard3D";
import { motion } from "framer-motion";

const Home = () => {
    const { auth, isLoading, kv } = usePuterStore();
    const [resumes, setResumes] = useState<any[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(true);

    useEffect(() => {
        const loadResumes = async () => {
            if (!auth) return;

            try {
                const keys = await kv.list('resume:');
                if (keys && Array.isArray(keys)) {
                    const resumeData = await Promise.all(
                        keys.map(async (key) => {
                            const keyValue = typeof key === 'string' ? key : key.key;
                            const data = await kv.get(keyValue);
                            return data ? JSON.parse(data) : null;
                        })
                    );

                    setResumes(resumeData.filter(Boolean));
                }
            } catch (error) {
                console.error('Error loading resumes:', error);
            } finally {
                setLoadingResumes(false);
            }
        };

        loadResumes();
    }, [auth, kv]);

    if (isLoading) {
        return (
            <main className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
                <Navbar />
                <section className="main-section">
                    <div className="page-heading py-16">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-7xl font-black leading-tight tracking-tight">Loading...</h1>
                                <p className="text-2xl text-slate-300 mt-2 font-medium">Please wait</p>
                            </div>
                        </div>
                        <h2 className="text-xl text-slate-200 max-w-3xl leading-relaxed">
                            Initializing your resume analytics dashboard...
                        </h2>
                    </div>
                </section>
            </main>
        );
    }

    if (!auth) {
        return (
            <main className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
                <Navbar />
                <section className="main-section">
                    <div className="page-heading py-16">
                        <FloatingCard3D className="floating-card max-w-4xl w-full" intensity={0.15}>
                            <div className="flex flex-col items-center gap-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <h1 className="text-6xl font-black leading-tight tracking-tight mb-4">
                                        Welcome to RESUMIND
                                    </h1>
                                    <p className="text-2xl text-slate-300 mb-8">
                                        AI-Powered Resume Analysis & Optimization
                                    </p>
                                    <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                                        Get instant AI-powered feedback on your resume. Upload your resume and job details to receive personalized optimization tips and ATS scoring.
                                    </p>
                                </div>
                                <a
                                    href="/auth"
                                    className="auth-button flex items-center justify-center gap-3 group"
                                >
                                    <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Get Started
                                </a>
                            </div>
                        </FloatingCard3D>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h1 className="text-7xl font-black leading-tight tracking-tight mb-4">
                        Resume Analytics
                    </h1>
                    <p className="text-2xl text-slate-300 mb-8 font-medium">
                        Track & Optimize Your Applications
                    </p>

                    <h2 className="text-xl text-slate-400 max-w-3xl mb-8 leading-relaxed">
                        {!loadingResumes && resumes?.length === 0
                            ? "Ready to boost your job search? Upload your first resume and get instant AI-powered insights to improve your chances of landing interviews."
                            : "Your resume performance dashboard. Review scores, track improvements, and optimize your applications with AI-powered feedback."
                        }
                    </h2>

                    {/* ✅ 3D Animated Button */}
                    <motion.a
                        href="/upload"
                        className="primary-button flex items-center justify-center gap-3 group px-8 py-4 text-lg font-semibold w-fit"
                        whileHover={{
                            scale: 1.05,
                            rotateX: 8,
                            rotateY: 8,
                            boxShadow: "0px 10px 20px rgba(0,0,0,0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Upload Resume
                    </motion.a>
                </div>

                {/* Resumes Section */}
                {loadingResumes ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <h2 className="text-xl text-slate-200 ml-4">Loading your resumes...</h2>
                    </div>
                ) : resumes?.length === 0 ? (
                    <FloatingCard3D className="floating-card max-w-3xl w-full" intensity={0.12}>
                        <div className="flex flex-col items-center gap-6 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-100 mb-2">No Resumes Yet</h3>
                                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                                    Start your journey by uploading your first resume. Our AI will analyze it and provide personalized feedback to help you stand out to employers.
                                </p>
                                <motion.a
                                    href="/upload"
                                    className="primary-button w-fit mx-auto flex items-center gap-3 group"
                                    whileHover={{
                                        scale: 1.05,
                                        rotateX: 8,
                                        rotateY: 8,
                                        boxShadow: "0px 10px 20px rgba(0,0,0,0.3)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Upload Resume
                                </motion.a>
                            </div>
                        </div>
                    </FloatingCard3D>
                ) : (
                    <div className="resumes-section">
                        {resumes.map((resume) => (
                            <FloatingCard3D key={resume.id} className="resume-card" intensity={0.08}>
                                <ResumeCard resume={resume} />
                            </FloatingCard3D>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default Home;
