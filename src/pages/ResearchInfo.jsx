import { Brain, Clock, Database, FlaskConical } from "lucide-react";

import { useNavigate } from "react-router";
import ResearchPage from "../components/ResearchPage";

function ResearchInfo() {
  const navigate = useNavigate();

  return (
    <ResearchPage
      title="Before you begin"
      subtitle="Please understand what this research assessment involves before participating."
      backTo="/"
      step="Research information"
    >
      <div className="space-y-4">
        <InfoCard icon={<Brain />} title="Purpose">
          This study explores how students use generative AI and whether AI
          primarily supports learning or replaces parts of independent thinking.
        </InfoCard>

        <InfoCard icon={<FlaskConical />} title="What you will do">
          You will answer questions about your AI use and later complete short
          learning, reasoning, verification, and cognitive engagement
          activities.
        </InfoCard>

        <InfoCard icon={<Clock />} title="Time">
          The complete assessment will eventually take approximately 25–40
          minutes depending on the experimental activity.
        </InfoCard>

        <InfoCard icon={<Database />} title="Local data storage">
          This version of the platform does not send your answers to an external
          research server. Research responses are stored in this browser and can
          later be exported by the researcher.
        </InfoCard>
      </div>

      <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
        <p className="text-sm leading-6 text-amber-100">
          This is currently a research prototype. The final participant
          information and consent procedure should use the version approved by
          the research supervisor or ethics review process before live data
          collection.
        </p>
      </div>

      <button
        onClick={() => navigate("/consent")}
        className="mt-8 w-full rounded-xl bg-indigo-500 px-6 py-4 font-semibold transition hover:bg-indigo-400"
      >
        Continue to Consent
      </button>
    </ResearchPage>
  );
}

function InfoCard({ icon, title, children }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
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

export default ResearchInfo;
