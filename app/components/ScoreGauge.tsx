import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);

    const percentage = score / 100;

    // Determine colors based on score
    const getScoreColors = (score: number) => {
        if (score >= 80) return { from: '#10b981', to: '#059669' }; // Green
        if (score >= 60) return { from: '#f59e0b', to: '#d97706' }; // Yellow
        return { from: '#ef4444', to: '#dc2626' }; // Red
    };

    const colors = getScoreColors(score);

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-20">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                    <defs>
                        <linearGradient
                            id={`gaugeGradient-${score}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop offset="0%" stopColor={colors.from} />
                            <stop offset="100%" stopColor={colors.to} />
                        </linearGradient>
                    </defs>

                    {/* Background arc */}
                    <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    {/* Foreground arc with rounded ends */}
                    <path
                        ref={pathRef}
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke={`url(#gaugeGradient-${score})`}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={pathLength}
                        strokeDashoffset={pathLength * (1 - percentage)}
                        style={{
                            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                        }}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <div className="text-2xl font-bold text-slate-100 pt-4">
                        {score}
                        <span className="text-slate-400 text-lg">/100</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreGauge;
