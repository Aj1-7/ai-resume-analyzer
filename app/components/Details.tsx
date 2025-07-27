import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
      <div
          className={cn(
              "flex flex-row gap-1 items-center px-3 py-1 rounded-full border",
              score > 69
                  ? "bg-emerald-900/30 border-emerald-500/30"
                  : score > 39
                      ? "bg-amber-900/30 border-amber-500/30"
                      : "bg-red-900/30 border-red-500/30"
          )}
      >
        <img
            src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
            alt="score"
            className="size-4"
        />
        <p
            className={cn(
                "text-sm font-semibold",
                score > 69
                    ? "text-emerald-300"
                    : score > 39
                        ? "text-amber-300"
                        : "text-red-300"
            )}
        >
          {score}/100
        </p>
      </div>
  );
};

const CategoryHeader = ({
                          title,
                          categoryScore,
                        }: {
  title: string;
  categoryScore: number;
}) => {
  return (
      <div className="flex flex-row gap-4 items-center py-3">
        <p className="text-2xl font-bold text-slate-100">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

const CategoryContent = ({
                           tips,
                         }: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
      <div className="flex flex-col gap-6 items-center w-full">
        <div className="bg-slate-700/30 border border-slate-600/30 w-full rounded-xl px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, index) => (
              <div className="flex flex-row gap-3 items-center" key={index}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  tip.type === "good" ? "bg-emerald-500/20" : "bg-amber-500/20"
                }`}>
                  <img
                    src={
                      tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"
                    }
                    alt="score"
                    className="size-4"
                  />
                </div>
                <p className="text-lg text-slate-200 font-medium">{tip.tip}</p>
              </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 w-full">
          {tips.map((tip, index) => (
              <div
                  key={index + tip.tip}
                  className={cn(
                      "flex flex-col gap-3 rounded-xl p-5 border",
                      tip.type === "good"
                          ? "bg-emerald-900/20 border-emerald-500/30"
                          : "bg-amber-900/20 border-amber-500/30"
                  )}
              >
                <div className="flex flex-row gap-3 items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    tip.type === "good" ? "bg-emerald-500/20" : "bg-amber-500/20"
                  }`}>
                    <img
                      src={
                        tip.type === "good"
                            ? "/icons/check.svg"
                            : "/icons/warning.svg"
                      }
                      alt="score"
                      className="size-4"
                    />
                  </div>
                  <p className="text-xl font-semibold text-slate-100">{tip.tip}</p>
                </div>
                <p className="text-slate-300 leading-relaxed pl-9">{tip.explanation}</p>
              </div>
          ))}
        </div>
      </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
      <div className="flex flex-col gap-4 w-full">
        <Accordion>
          <AccordionItem id="tone-style">
            <AccordionHeader itemId="tone-style">
              <CategoryHeader
                  title="Tone & Style"
                  categoryScore={feedback.toneAndStyle.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback.toneAndStyle.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="content">
            <AccordionHeader itemId="content">
              <CategoryHeader
                  title="Content"
                  categoryScore={feedback.content.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback.content.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="structure">
            <AccordionHeader itemId="structure">
              <CategoryHeader
                  title="Structure"
                  categoryScore={feedback.structure.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback.structure.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="skills">
            <AccordionHeader itemId="skills">
              <CategoryHeader
                  title="Skills"
                  categoryScore={feedback.skills.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback.skills.tips} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  );
};

export default Details;
