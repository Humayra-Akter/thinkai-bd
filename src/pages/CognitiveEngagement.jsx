import { BrainCircuit, CheckCircle2 } from "lucide-react";

import ResearchPage from "../components/ResearchPage";

function CognitiveEngagement() {
  return (
    <ResearchPage
      title="Cognitive Engagement"
      subtitle="The next section measures how mentally engaged you were during the experimental task."
      backTo="/post-experiment"
      step="Assessment 4"
    >
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
        <div className="flex gap-4">
          <CheckCircle2 className="shrink-0 text-emerald-300" />

          <div>
            <h2 className="font-semibold">Post-task assessment complete</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Mental effort, confidence, task difficulty, experimental
              compliance, and perceived understanding have been recorded.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex gap-4">
          <BrainCircuit className="shrink-0 text-indigo-300" />

          <div>
            <h2 className="font-semibold">Next: Cognitive Engagement</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              This stage will capture sustained attention, active reasoning,
              mental involvement, and deep versus surface processing during the
              experimental task.
            </p>
          </div>
        </div>
      </div>
    </ResearchPage>
  );
}

export default CognitiveEngagement;
