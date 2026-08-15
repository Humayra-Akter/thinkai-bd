import { QuestionCard } from "./LikertQuestion";

function SingleChoiceQuestion({ question, value, onChange }) {
  return (
    <QuestionCard number={question.number} question={question.question}>
      <div className="space-y-2">
        {question.options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-indigo-400 bg-indigo-500/15"
                  : "border-slate-700 bg-slate-950/30 hover:border-slate-500"
              }`}
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  selected ? "border-indigo-400" : "border-slate-600"
                }`}
              >
                {selected && (
                  <div className="h-2.5 w-2.5 rounded-full bg-indigo-400" />
                )}
              </div>

              <span className={selected ? "text-indigo-100" : "text-slate-300"}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </QuestionCard>
  );
}

export default SingleChoiceQuestion;
