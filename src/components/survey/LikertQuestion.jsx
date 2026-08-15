import { likertOptions } from "../../data/aiUsageQuestions";

function LikertQuestion({ question, value, onChange }) {
  return (
    <QuestionCard number={question.number} question={question.question}>
      <div className="grid gap-2 md:grid-cols-5">
        {likertOptions.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-xl border px-3 py-4 text-sm transition ${
                selected
                  ? "border-indigo-400 bg-indigo-500/15 text-indigo-100"
                  : "border-slate-700 bg-slate-950/40 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              }`}
            >
              <div className="font-semibold">{option.value}</div>

              <div className="mt-1 text-xs leading-4">{option.label}</div>
            </button>
          );
        })}
      </div>
    </QuestionCard>
  );
}

export function QuestionCard({ number, question, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex gap-4">
        {number && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm font-semibold text-slate-400">
            {number}
          </div>
        )}

        <div className="w-full">
          <h2 className="font-medium leading-7 text-slate-100">{question}</h2>

          <div className="mt-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default LikertQuestion;
