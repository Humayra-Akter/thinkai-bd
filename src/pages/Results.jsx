import { useEffect, useState } from "react";

import {
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Gauge,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router";

import ResearchPage from "../components/ResearchPage";

import {
  getActiveParticipantId,
  updateParticipantProgress,
} from "../services/sessionService";

import { calculateResearchScores } from "../services/scoringService";

function Results() {
  const navigate = useNavigate();

  const participantId = getActiveParticipantId();

  const [scores, setScores] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function initialize() {
      if (!participantId) {
        navigate("/consent", {
          replace: true,
        });

        return;
      }

      try {
        const calculated = await calculateResearchScores(participantId);

        setScores(calculated);

        await updateParticipantProgress("results");
      } catch (error) {
        console.error(error);

        setError("Your results could not be calculated.");
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [participantId, navigate]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Calculating research profile...
      </main>
    );
  }

  if (error || !scores) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-slate-400">
        {error || "Results are unavailable."}
      </main>
    );
  }

  const {
    learningPattern,
    usage,
    offloading,
    dependency,
    engagement,
    verification,
  } = scores;

  return (
    <ResearchPage
      title="Your AI Learning Profile"
      subtitle="This feedback summarizes patterns in your responses and tasks. It is a research profile, not an academic grade or psychological diagnosis."
      step="Results"
    >
      <div className="rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-7">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
            <Sparkles size={23} />
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              AI Learning Pattern
            </div>

            <h2 className="mt-2 text-2xl font-bold text-white">
              {learningPattern.label}
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              {learningPattern.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <MetricCard
          icon={<Sparkles />}
          label="AI Productivity & Access"
          value={usage.productivityAccess.percent}
          description="How strongly AI supports speed, access, language, and academic productivity."
          positive
        />

        <MetricCard
          icon={<BrainCircuit />}
          label="Higher-Order Offloading"
          value={offloading.higherOrder.percent}
          description="How often reasoning, planning, evaluation, and problem-solving are delegated to AI."
          caution
        />

        <MetricCard
          icon={<ShieldCheck />}
          label="Independent Learning Resilience"
          value={
            dependency.dependencyRisk.percent !== null
              ? 100 - dependency.dependencyRisk.percent
              : null
          }
          description="An inverse view of dependency risk, reflecting independence when AI is unavailable."
          positive
        />

        <MetricCard
          icon={<Gauge />}
          label="Cognitive Engagement"
          value={engagement.overall.percent}
          description="Attention, active reasoning, deep processing, and independent thinking during the task."
          positive
        />

        <MetricCard
          icon={<SearchCheck />}
          label="Verification Accuracy"
          value={verification.accuracyPercent}
          description={`${verification.correct} of ${verification.total} AI answers were judged accurately.`}
          positive
        />

        <MetricCard
          icon={<BarChart3 />}
          label="Socratic AI Use"
          value={usage.socraticUse.percent}
          description="How often you use AI for follow-up questioning, understanding, and challenging your thinking."
          positive
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold">A closer look</h2>

        <div className="mt-6 space-y-5">
          <DetailBar
            label="Lower-order offloading"
            value={offloading.lowerOrder.percent}
          />

          <DetailBar
            label="Higher-order offloading"
            value={offloading.higherOrder.percent}
          />

          <DetailBar
            label="Verification tendency"
            value={usage.verificationTendency.percent}
          />

          <DetailBar
            label="Metacognitive stamina"
            value={dependency.metacognitiveStamina.percent}
          />

          <DetailBar
            label="Independent understanding"
            value={dependency.independentUnderstanding.percent}
          />

          <DetailBar
            label="Deep cognitive processing"
            value={engagement.deepProcessing.percent}
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
        <h2 className="font-semibold text-amber-100">How to interpret this</h2>

        <p className="mt-3 text-sm leading-7 text-slate-400">
          High AI use is not automatically negative. For example, using AI
          heavily for translation, explanation, grammar, or routine work can
          coexist with strong independent reasoning. The main issue investigated
          in this study is whether important cognitive work is supported by AI
          or replaced by it.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex gap-4">
          <CheckCircle2 className="shrink-0 text-emerald-300" />

          <div>
            <h2 className="font-semibold">
              Your experimental condition is not displayed here
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Group assignment and detailed experimental information remain in
              the researcher dataset. This prevents participants from learning
              information that could influence other participants during ongoing
              data collection.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/debrief")}
        className="mt-8 w-full rounded-xl bg-indigo-500 px-6 py-4 font-semibold transition hover:bg-indigo-400"
      >
        Continue
      </button>
    </ResearchPage>
  );
}

function MetricCard({ icon, label, value, description, caution = false }) {
  const displayValue =
    value === null || value === undefined ? "—" : `${Math.round(value)}%`;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            caution
              ? "bg-amber-500/10 text-amber-300"
              : "bg-indigo-500/10 text-indigo-300"
          }`}
        >
          {icon}
        </div>

        <div
          className={`text-2xl font-bold ${
            caution ? "text-amber-300" : "text-indigo-300"
          }`}
        >
          {displayValue}
        </div>
      </div>

      <h3 className="mt-5 font-semibold">{label}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function DetailBar({ label, value }) {
  const safeValue =
    value === null || value === undefined
      ? 0
      : Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="text-slate-400">{label}</span>

        <span className="font-semibold text-slate-200">
          {value === null || value === undefined
            ? "—"
            : `${Math.round(value)}%`}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{
            width: `${safeValue}%`,
          }}
        />
      </div>
    </div>
  );
}

export default Results;
