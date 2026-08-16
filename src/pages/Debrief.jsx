import { CheckCircle2, FlaskConical, ShieldCheck } from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router";

import ResearchPage from "../components/ResearchPage";

import { getActiveParticipantId } from "../services/sessionService";

import { db } from "../db/researchDb";

function Debrief() {
  const navigate = useNavigate();

  const participantId = getActiveParticipantId();

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function finishSession() {
      if (!participantId) {
        navigate("/", {
          replace: true,
        });

        return;
      }

      const now = new Date().toISOString();

      await db.participants.update(participantId, {
        status: "COMPLETED",

        currentStep: "completed",

        completedAt: now,

        updatedAt: now,
      });

      const experiment = await db.experimentSessions
        .where("participantId")
        .equals(participantId)
        .first();

      if (experiment && !experiment.completedAt) {
        await db.experimentSessions.update(experiment.id, {
          status: "COMPLETED",

          completedAt: now,

          updatedAt: now,
        });
      }

      setCompleted(true);
    }

    finishSession();
  }, [participantId, navigate]);

  return (
    <ResearchPage
      title="Thank You for Participating"
      subtitle="You have completed all parts of the ThinkAI BD research session."
      step="Complete"
    >
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
        <div className="flex gap-4">
          <CheckCircle2 className="shrink-0 text-emerald-300" />

          <div>
            <h2 className="font-semibold">Session completed</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {completed
                ? "Your research session has been marked as complete."
                : "Finalizing your research session..."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex gap-4">
          <FlaskConical className="shrink-0 text-indigo-300" />

          <div>
            <h2 className="font-semibold">What was this study examining?</h2>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              The study examines whether generative AI functions primarily as a
              learning support or whether some patterns of use encourage
              cognitive offloading, dependency, reduced verification, or weaker
              independent reasoning.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              Participants were placed into different preparation conditions so
              that AI-assisted and independent preparation could later be
              compared. The unexpected question was included to examine
              reasoning after the preparation support was removed.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex gap-4">
          <ShieldCheck className="shrink-0 text-indigo-300" />

          <div>
            <h2 className="font-semibold">Important</h2>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Please avoid discussing the exact experimental task, unexpected
              question, or verification answers with people who may participate
              later. Knowing these details in advance could affect the research
              results.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-8 w-full rounded-xl bg-indigo-500 px-6 py-4 font-semibold transition hover:bg-indigo-400"
      >
        Return to Home
      </button>
    </ResearchPage>
  );
}

export default Debrief;
