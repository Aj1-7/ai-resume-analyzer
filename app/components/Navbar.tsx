import {Link} from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="group">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl">
                            <span className="text-white font-bold text-xl">R</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full border-2 border-slate-800"></div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-2xl font-black text-gradient tracking-tight group-hover:scale-105 transition-transform duration-300">RESUMIND</p>
                        <p className="text-xs text-slate-400 font-medium tracking-wider">AI Resume Analyzer</p>
                    </div>
                </div>
            </Link>
            
            <div className="flex items-center gap-4">
                <Link to="/" className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-slate-100 transition-colors duration-200 group">
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    
                </Link>
                
                <Link to="/upload" className="primary-button w-fit flex items-center gap-3 group px-6 py-3">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span className="font-semibold">Upload Resume</span>
                </Link>
            </div>
        </nav>
    )
}
export default Navbar
