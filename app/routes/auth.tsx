import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";

export const meta = () => ([
    { title: 'Resumind | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center p-6">
            <div className="floating-card max-w-md w-full">
                <section className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gradient mb-2">Welcome</h1>
                            <h2 className="text-lg text-dark-200">Log In to Continue Your Job Journey</h2>
                        </div>
                    </div>
                    <div>
                        {isLoading ? (
                            <button className="auth-button animate-pulse flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <p>Signing you in...</p>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button className="auth-button flex items-center justify-center gap-2 group" onClick={auth.signOut}>
                                        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <p>Log Out</p>
                                    </button>
                                ) : (
                                    <button className="auth-button flex items-center justify-center gap-2 group" onClick={auth.signIn}>
                                        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        <p>Log In</p>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Auth
