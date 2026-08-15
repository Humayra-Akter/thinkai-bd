import { Check } from "lucide-react";

import { QuestionCard } from "./LikertQuestion";

function MultiChoiceQuestion({ question, value = [], onChange }) {
  function toggle(optionValue) {
    let nextValue;

    if (optionValue === "NONE") {
      nextValue = value.includes("NONE") ? [] : ["NONE"];
    } else {
      const withoutNone = value.filter((item) => item !== "NONE");

      if (withoutNone.includes(optionValue)) {
        nextValue = withoutNone.filter((item) => item !== optionValue);
      } else {
        nextValue = [...withoutNone, optionValue];
      }
    }

    onChange(nextValue);
  }

  return (
    <QuestionCard number={question.number} question={question.question}>
      <p className="mb-4 text-xs text-slate-500">Select all that apply.</p>

      <div className="grid gap-2 sm:grid-cols-2">
        {question.options.map((option) => {
          const selected = value.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-indigo-400 bg-indigo-500/15"
                  : "border-slate-700 bg-slate-950/30 hover:border-slate-500"
              }`}
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                  selected
                    ? "border-indigo-400 bg-indigo-500 text-white"
                    : "border-slate-600"
                }`}
              >
                {selected && <Check size={14} />}
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

export default MultiChoiceQuestion;
