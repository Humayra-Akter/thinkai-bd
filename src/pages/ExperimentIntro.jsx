import {
  BrainCircuit,
  Clock3,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

import ResearchPage from "../components/ResearchPage";

function ExperimentIntro() {
  return (
    <ResearchPage
      title="Experimental Learning Task"
      subtitle="The questionnaire section is complete. The next stage examines how students prepare, reason, and respond to unexpected questions."
      backTo="/dependency"
      step="Experiment"
    >
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-100">
              Initial assessments complete
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Your questionnaire responses have been saved. The next activity
              measures actual task behaviour and performance.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <ExperimentCard icon={<BrainCircuit />} title="Preparation Task">
          You will receive an academic topic and prepare a structured response.
        </ExperimentCard>

        <ExperimentCard icon={<Clock3 />} title="Timed Activity">
          Preparation will take place within a fixed amount of time so that
          participants complete the task under comparable conditions.
        </ExperimentCard>

        <ExperimentCard
          icon={<MessageSquareText />}
          title="Unexpected Question"
        >
          After preparation, you will receive a new critical question and
          respond independently.
        </ExperimentCard>
      </div>

      <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
        <p className="text-sm leading-6 text-amber-100">
          Do not begin this section until you are ready to complete the
          experimental activity without interruption.
        </p>
      </div>

      <button
        disabled
        className="mt-8 w-full cursor-not-allowed rounded-xl bg-indigo-500 px-6 py-4 font-semibold opacity-40"
      >
        Begin Experimental Task
      </button>

      <p className="mt-3 text-center text-xs text-slate-500">
        Experimental assignment will be enabled in the next development step.
      </p>
    </ResearchPage>
  );
}

function ExperimentCard({ icon, title, children }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
        {icon}
      </div>

      <div>
        <h2 className="font-semibold">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">{children}</p>
      </div>
    </div>
  );
}

export default ExperimentIntro;
