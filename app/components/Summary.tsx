import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 70 ? 'text-emerald-400'
            : score > 49
        ? 'text-amber-400' : 'text-red-400';

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-3 items-center justify-center">
                    <p className="text-xl font-semibold text-slate-200">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className="text-2xl font-bold">
                    <span className={textColor}>{score}</span>
                    <span className="text-slate-400">/100</span>
                </p>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-slate-800/60 backdrop-blur-md border border-slate-600/30 rounded-2xl shadow-xl w-full overflow-hidden">
            <div className="flex flex-row items-center p-6 gap-6 border-b border-slate-600/30">
                <ScoreGauge score={feedback.overallScore} />

                <div className="flex flex-col gap-3">
                    <h2 className="text-3xl font-bold text-slate-100">Your Resume Score</h2>
                    <p className="text-slate-300 leading-relaxed">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
                <Category title="Content" score={feedback.content.score} />
                <Category title="Structure" score={feedback.structure.score} />
                <Category title="Skills" score={feedback.skills.score} />
            </div>
        </div>
    )
}
export default Summary
