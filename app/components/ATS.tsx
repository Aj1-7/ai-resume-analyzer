import React from 'react'

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine background gradient based on score
  const gradientClass = score > 69
    ? 'from-emerald-900/30 to-slate-800/60'
    : score > 49
      ? 'from-amber-900/30 to-slate-800/60'
      : 'from-red-900/30 to-slate-800/60';

  // Determine icon based on score
  const iconSrc = score > 69
    ? '/icons/ats-good.svg'
    : score > 49
      ? '/icons/ats-warning.svg'
      : '/icons/ats-bad.svg';

  // Determine subtitle based on score
  const subtitle = score > 69
    ? 'Great Job!'
    : score > 49
      ? 'Good Start'
      : 'Needs Improvement';

  // Determine subtitle color based on score
  const subtitleColor = score > 69
    ? 'text-emerald-400'
    : score > 49
      ? 'text-amber-400'
      : 'text-red-400';

  return (
    <div className={`bg-gradient-to-b ${gradientClass} backdrop-blur-md border border-slate-600/30 rounded-2xl shadow-xl w-full p-6`}>
      {/* Top section with icon and headline */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center">
          <img src={iconSrc} alt="ATS Score Icon" className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100">ATS Score - {score}/100</h2>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-6">
        <h3 className={`text-xl font-semibold mb-3 ${subtitleColor}`}>{subtitle}</h3>
        <p className="text-slate-300 mb-6 leading-relaxed">
          This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
        </p>

        {/* Suggestions list */}
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/20">
              <div className={`w-5 h-5 mt-1 rounded-full flex items-center justify-center ${
                suggestion.type === "good" ? "bg-emerald-500/20" : "bg-amber-500/20"
              }`}>
                <img
                  src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                  alt={suggestion.type === "good" ? "Check" : "Warning"}
                  className="w-3 h-3"
                />
              </div>
              <p className={`text-sm leading-relaxed ${
                suggestion.type === "good" ? "text-emerald-300" : "text-amber-300"
              }`}>
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing encouragement */}
      <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/20">
        <p className="text-slate-300 italic leading-relaxed">
          Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
        </p>
      </div>
    </div>
  )
}

export default ATS
