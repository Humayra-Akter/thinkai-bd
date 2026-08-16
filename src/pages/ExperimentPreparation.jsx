import { useEffect, useRef, useState } from "react";

import { Bot, Brain, Clock3, Save, ShieldAlert } from "lucide-react";

import { useNavigate } from "react-router";

import { mainExperimentTask } from "../data/experimentTasks";

import { getActiveParticipantId } from "../services/sessionService";

import {
  getExperimentForParticipant,
  savePreparationDraft,
  startPreparation,
  submitPreparation,
} from "../services/experimentService";

import { countWords, formatTime, getRemainingSeconds } from "../utils/time";

function ExperimentPreparation() {
  const navigate = useNavigate();

  const participantId = getActiveParticipantId();

  const [experiment, setExperiment] = useState(null);

  const [draft, setDraft] = useState("");

  const [remaining, setRemaining] = useState(0);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const autoSubmitted = useRef(false);

  useEffect(() => {
    async function initialize() {
      if (!participantId) {
        navigate("/consent", {
          replace: true,
        });

        return;
      }

      let current = await getExperimentForParticipant(participantId);

      if (!current) {
        navigate("/experiment-intro", {
          replace: true,
        });

        return;
      }

      if (current.status === "PREPARATION_COMPLETE") {
        navigate("/experiment/challenge", {
          replace: true,
        });

        return;
      }

      if (
        current.status === "CHALLENGE_ACTIVE" ||
        current.status === "CHALLENGE_COMPLETE"
      ) {
        navigate("/experiment/challenge", {
          replace: true,
        });

        return;
      }

      current = await startPreparation(current.id);

      setExperiment(current);

      setDraft(current.preparationDraft || "");

      setRemaining(getRemainingSeconds(current.preparationEndsAt));

      setLoading(false);
    }

    initialize();
  }, [participantId, navigate]);

  /*
    Persistent countdown.

    We calculate from the stored deadline,
    not from a simple decrementing number.
  */
  useEffect(() => {
    if (!experiment?.preparationEndsAt) {
      return;
    }

    const interval = setInterval(() => {
      setRemaining(getRemainingSeconds(experiment.preparationEndsAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [experiment]);

  /*
    Autosave draft after typing stops.
  */
  useEffect(() => {
    if (!experiment || loading) {
      return;
    }

    const timeout = setTimeout(() => {
      savePreparationDraft(experiment.id, draft).catch(console.error);
    }, 600);

    return () => clearTimeout(timeout);
  }, [draft, experiment, loading]);

  /*
    Automatic submission when time expires.
  */
  useEffect(() => {
    if (loading || !experiment || remaining !== 0 || autoSubmitted.current) {
      return;
    }

    autoSubmitted.current = true;

    finishPreparation("TIME_EXPIRED");
  }, [remaining, loading, experiment]);

  const wordCount = countWords(draft);

  const hasMinimum = wordCount >= mainExperimentTask.minimumPreparationWords;

  async function finishPreparation(reason = "MANUAL") {
    if (submitting || !experiment) {
      return;
    }

    if (reason === "MANUAL" && !hasMinimum) {
      return;
    }

    try {
      setSubmitting(true);

      await submitPreparation(experiment.id, draft, reason);

      navigate("/experiment/challenge");
    } catch (error) {
      console.error(error);

      alert("Your preparation could not be submitted.");

      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Preparing experiment...
      </main>
    );
  }

  const aiCondition = experiment.group === "AI_ASSISTED";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Experimental Preparation
            </div>

            <div className="mt-1 font-semibold">Assessment Reform Debate</div>
          </div>

          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-lg font-bold ${
              remaining <= 300
                ? "border-red-400/30 bg-red-400/10 text-red-300"
                : "border-indigo-400/20 bg-indigo-400/10 text-indigo-200"
            }`}
          >
            <Clock3 size={19} />

            {formatTime(remaining)}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div
          className={`mb-6 rounded-2xl border p-5 ${
            aiCondition
              ? "border-indigo-400/20 bg-indigo-400/5"
              : "border-amber-400/20 bg-amber-400/5"
          }`}
        >
          <div className="flex gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                aiCondition
                  ? "bg-indigo-500/10 text-indigo-300"
                  : "bg-amber-500/10 text-amber-300"
              }`}
            >
              {aiCondition ? <Bot size={22} /> : <Brain size={22} />}
            </div>

            <div>
              <h2 className="font-semibold">
                {aiCondition
                  ? "AI-Assisted Preparation"
                  : "Independent Preparation"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {aiCondition ? (
                  <>
                    You may use a generative AI tool such as ChatGPT, Gemini,
                    Claude, or DeepSeek while preparing. You may ask for ideas,
                    structure, counterarguments, explanations, or phrasing. Do
                    not ask another person for assistance.
                  </>
                ) : (
                  <>
                    Complete the preparation using only your own knowledge and
                    reasoning. Do not use generative AI, search engines,
                    websites, textbooks, notes, or assistance from another
                    person.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Debate Statement
              </div>

              <h1 className="mt-4 text-2xl font-bold leading-9">
                “{mainExperimentTask.statement}”
              </h1>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="font-semibold">Your task</h2>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                {mainExperimentTask.instructions}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-amber-300" />

                <h2 className="font-semibold">Important</h2>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Your notes will be saved automatically. Refreshing the page will
                not restart the timer.
              </p>
            </div>
          </section>

          <section>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold">Preparation Workspace</h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Write your argument, outline, supporting points, or speech
                    notes.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Save size={14} />
                  Autosaved
                </div>
              </div>

              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                disabled={remaining === 0 || submitting}
                placeholder="Start preparing your argument here..."
                className="mt-5 min-h-[430px] w-full resize-y rounded-xl border border-slate-700 bg-slate-950/70 p-5 leading-7 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-400 disabled:opacity-60"
              />

              <div className="mt-3 flex items-center justify-between gap-4 text-xs">
                <span
                  className={hasMinimum ? "text-emerald-400" : "text-slate-500"}
                >
                  {wordCount} words
                </span>

                <span className="text-slate-500">
                  Minimum {mainExperimentTask.minimumPreparationWords} words for
                  manual submission
                </span>
              </div>

              <button
                onClick={() => finishPreparation("MANUAL")}
                disabled={!hasMinimum || submitting || remaining === 0}
                className="mt-6 w-full rounded-xl bg-indigo-500 px-6 py-4 font-semibold transition enabled:hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? "Submitting..." : "Finish Preparation"}
              </button>

              <p className="mt-3 text-center text-xs text-slate-500">
                Submitting ends your preparation period immediately. You cannot
                return to edit it.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ExperimentPreparation;
