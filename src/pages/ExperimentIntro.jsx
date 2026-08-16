import { useEffect, useState } from "react";

import {
  BrainCircuit,
  Clock3,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router";

import ResearchPage from "../components/ResearchPage";

import { getActiveParticipantId } from "../services/sessionService";

import {
  getExperimentForParticipant,
  getExperimentRoute,
  initializeExperiment,
} from "../services/experimentService";

function ExperimentIntro() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const participantId = getActiveParticipantId();

  useEffect(() => {
    async function checkExisting() {
      if (!participantId) {
        navigate("/consent", {
          replace: true,
        });

        return;
      }

      const existing = await getExperimentForParticipant(participantId);

      if (existing) {
        navigate(getExperimentRoute(existing), {
          replace: true,
        });
      }
    }

    checkExisting();
  }, [participantId, navigate]);

  async function handleBegin() {
    if (!participantId) {
      return;
    }

    try {
      setLoading(true);

      const experiment = await initializeExperiment(participantId);

      navigate(getExperimentRoute(experiment));
    } catch (error) {
      console.error(error);

      alert("The experiment could not be initialized.");

      setLoading(false);
    }
  }

  return (
    <ResearchPage
      title="Experimental Learning Task"
      subtitle="The questionnaire section is complete. The next stage examines actual preparation and independent reasoning."
      backTo="/dependency"
      step="Experiment"
    >
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
        <div className="flex gap-4">
          <IconBox green>
            <ShieldCheck size={21} />
          </IconBox>

          <div>
            <h2 className="font-semibold text-slate-100">
              Initial assessments complete
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Your questionnaire responses have been saved. Your experimental
              condition will be assigned only when you begin.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <ExperimentCard icon={<BrainCircuit />} title="Same task">
          Participants receive the same argumentative preparation task.
        </ExperimentCard>

        <ExperimentCard icon={<Clock3 />} title="30-minute preparation">
          The preparation period uses a fixed timer that continues even if the
          page is refreshed.
        </ExperimentCard>

        <ExperimentCard
          icon={<MessageSquareText />}
          title="Unexpected question"
        >
          After preparation, every participant must answer a new critical
          question without AI assistance.
        </ExperimentCard>
      </div>

      <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
        <p className="text-sm leading-6 text-amber-100">
          Start only when you can complete the experimental activity without a
          long interruption. Once preparation begins, the timer cannot be
          restarted.
        </p>
      </div>

      <button
        onClick={handleBegin}
        disabled={loading}
        className="mt-8 w-full rounded-xl bg-indigo-500 px-6 py-4 font-semibold transition enabled:hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Assigning Experiment..." : "Begin Experimental Task"}
      </button>
    </ResearchPage>
  );
}

function IconBox({ children, green = false }) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
        green
          ? "bg-emerald-500/10 text-emerald-300"
          : "bg-indigo-500/10 text-indigo-300"
      }`}
    >
      {children}
    </div>
  );
}

function ExperimentCard({ icon, title, children }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <IconBox>{icon}</IconBox>

      <div>
        <h2 className="font-semibold">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">{children}</p>
      </div>
    </div>
  );
}

export default ExperimentIntro;
