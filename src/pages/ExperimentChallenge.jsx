import { useEffect, useRef, useState } from "react";

import { BrainCircuit, Clock3, Lock } from "lucide-react";

import { useNavigate } from "react-router";

import { mainExperimentTask } from "../data/experimentTasks";

import { getActiveParticipantId } from "../services/sessionService";

import {
  getExperimentForParticipant,
  saveChallengeDraft,
  startChallenge,
  submitChallenge,
} from "../services/experimentService";

import { countWords, formatTime, getRemainingSeconds } from "../utils/time";

function ExperimentChallenge() {
  const navigate = useNavigate();

  const participantId = getActiveParticipantId();

  const [experiment, setExperiment] = useState(null);

  const [response, setResponse] = useState("");

  const [started, setStarted] = useState(false);

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

      const current = await getExperimentForParticipant(participantId);

      if (!current) {
        navigate("/experiment-intro", {
          replace: true,
        });

        return;
      }

      if (current.status === "CHALLENGE_COMPLETE") {
        navigate("/post-experiment", {
          replace: true,
        });

        return;
      }

      if (
        current.status !== "PREPARATION_COMPLETE" &&
        current.status !== "CHALLENGE_ACTIVE"
      ) {
        navigate("/experiment/preparation", {
          replace: true,
        });

        return;
      }

      setExperiment(current);

      setResponse(current.challengeDraft || "");

      if (current.status === "CHALLENGE_ACTIVE") {
        setStarted(true);

        setRemaining(getRemainingSeconds(current.challengeEndsAt));
      }

      setLoading(false);
    }

    initialize();
  }, [participantId, navigate]);

  useEffect(() => {
    if (!started || !experiment?.challengeEndsAt) {
      return;
    }

    const interval = setInterval(() => {
      setRemaining(getRemainingSeconds(experiment.challengeEndsAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [started, experiment]);

  useEffect(() => {
    if (!started || !experiment) {
      return;
    }

    const timeout = setTimeout(() => {
      saveChallengeDraft(experiment.id, response).catch(console.error);
    }, 500);

    return () => clearTimeout(timeout);
  }, [response, experiment, started]);

  useEffect(() => {
    if (
      !started ||
      loading ||
      !experiment ||
      remaining !== 0 ||
      autoSubmitted.current
    ) {
      return;
    }

    autoSubmitted.current = true;

    finishChallenge("TIME_EXPIRED");
  }, [remaining, started, loading, experiment]);

  async function handleBeginChallenge() {
    try {
      const updated = await startChallenge(experiment.id);

      setExperiment(updated);

      setRemaining(getRemainingSeconds(updated.challengeEndsAt));

      setStarted(true);
    } catch (error) {
      console.error(error);

      alert("Could not start the challenge.");
    }
  }

  const wordCount = countWords(response);

  const hasMinimum = wordCount >= mainExperimentTask.challenge.minimumWords;

  async function finishChallenge(reason = "MANUAL") {
    if (!experiment || submitting) {
      return;
    }

    if (reason === "MANUAL" && !hasMinimum) {
      return;
    }

    try {
      setSubmitting(true);

      await submitChallenge(experiment.id, response, reason);

      navigate("/post-experiment");
    } catch (error) {
      console.error(error);

      alert("The response could not be submitted.");

      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading challenge...
      </main>
    );
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
            <Lock size={25} />
          </div>

          <h1 className="mt-7 text-4xl font-bold">Independent Challenge</h1>

          <p className="mt-5 leading-8 text-slate-400">
            Your preparation phase has ended. The next question was not shown to
            you during preparation.
          </p>

          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
            <h2 className="font-semibold text-red-200">
              AI and external assistance are now prohibited
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Both experimental groups must complete the next task
              independently. Close any AI tool, search engine, notes, website,
              or other source you used during preparation.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex gap-4">
              <BrainCircuit className="shrink-0 text-indigo-300" />

              <div>
                <h2 className="font-semibold">What happens next?</h2>

                <p className="mt-2 text-sm leading-7 text-slate-400">
                  When you click Begin, an unexpected critical question will
                  appear and a 5-minute timer will immediately start.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleBeginChallenge}
            className="mt-8 w-full rounded-xl bg-indigo-500 px-6 py-4 font-semibold transition hover:bg-indigo-400"
          >
            I Have Closed External Assistance — Begin
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-red-300">
              Independent Response
            </div>

            <div className="mt-1 text-sm text-slate-400">
              No AI or external assistance
            </div>
          </div>

          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-lg font-bold ${
              remaining <= 60
                ? "border-red-400/30 bg-red-400/10 text-red-300"
                : "border-indigo-400/20 bg-indigo-400/10 text-indigo-200"
            }`}
          >
            <Clock3 size={19} />

            {formatTime(remaining)}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/5 p-7">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
            Unexpected Question
          </div>

          <h1 className="mt-4 text-2xl font-bold leading-9">
            {mainExperimentTask.challenge.question}
          </h1>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="font-semibold">Your independent response</h2>

          <p className="mt-2 text-sm text-slate-500">
            Respond using your own reasoning.
          </p>

          <textarea
            value={response}
            onChange={(event) => setResponse(event.target.value)}
            disabled={remaining === 0 || submitting}
            placeholder="Write your response..."
            className="mt-5 min-h-[320px] w-full resize-y rounded-xl border border-slate-700 bg-slate-950/70 p-5 leading-7 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-400 disabled:opacity-60"
          />

          <div className="mt-3 flex justify-between gap-4 text-xs">
            <span
              className={hasMinimum ? "text-emerald-400" : "text-slate-500"}
            >
              {wordCount} words
            </span>

            <span className="text-slate-500">
              Minimum {mainExperimentTask.challenge.minimumWords} words
            </span>
          </div>

          <button
            onClick={() => finishChallenge("MANUAL")}
            disabled={!hasMinimum || submitting || remaining === 0}
            className="mt-6 w-full rounded-xl bg-indigo-500 px-6 py-4 font-semibold transition enabled:hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Submitting..." : "Submit Independent Response"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default ExperimentChallenge;
