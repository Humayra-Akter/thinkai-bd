import { CheckCircle2, FlaskConical } from "lucide-react";

import ResearchPage from "../components/ResearchPage";

function PostExperiment() {
  return (
    <ResearchPage
      title="Experimental Task Complete"
      subtitle="Your preparation and independent response have been stored successfully."
      step="Post-experiment"
    >
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <h2 className="font-semibold">Behavioural experiment completed</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Your assigned condition, preparation response, timing information,
              and independent challenge response have all been preserved
              locally.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex gap-4">
          <FlaskConical className="shrink-0 text-indigo-300" />

          <div>
            <h2 className="font-semibold">Next stage</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              We will now collect the manipulation check, perceived mental
              effort, confidence, CES-AI cognitive engagement, and verification
              behaviour.
            </p>
          </div>
        </div>
      </div>
    </ResearchPage>
  );
}

export default PostExperiment;
