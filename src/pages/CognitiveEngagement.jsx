import { useEffect, useMemo, useState } from "react";

import { BrainCircuit, CheckCircle2, Save } from "lucide-react";

import { useNavigate } from "react-router";

import ResearchPage from "../components/ResearchPage";
import SurveyProgress from "../components/survey/SurveyProgress";
import LikertQuestion from "../components/survey/LikertQuestion";

import { cognitiveEngagementQuestions } from "../data/cognitiveEngagementQuestions";

import {
  getActiveParticipantId,
  updateParticipantProgress,
} from "../services/sessionService";

import { getSectionResponses, saveResponse } from "../services/responseService";

const SECTION = "COGNITIVE_ENGAGEMENT";

function CognitiveEngagement() {
  const navigate = useNavigate();

  const participantId = getActiveParticipantId();

  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(true);

  const [savingQuestion, setSavingQuestion] = useState(null);

  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    async function initialize() {
      if (!participantId) {
        navigate("/consent", {
          replace: true,
        });

        return;
      }

      try {
        const stored = await getSectionResponses(participantId, SECTION);

        setAnswers(stored);

        await updateParticipantProgress("cognitive-engagement");
      } catch (error) {
        console.error("Could not load cognitive engagement responses:", error);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [participantId, navigate]);

  const questions = useMemo(
    () =>
      cognitiveEngagementQuestions.map((question, index) => ({
        ...question,
        number: index + 1,
      })),
    [],
  );

  const answeredCount = questions.filter((question) => {
    const value = answers[question.id];

    return value !== undefined && value !== null && value !== "";
  }).length;

  const allRequiredAnswered = questions
    .filter((question) => question.required)
    .every((question) => {
      const value = answers[question.id];

      return value !== undefined && value !== null && value !== "";
    });

  async function handleAnswer(question, value) {
    setAnswers((current) => ({
      ...current,
      [question.id]: value,
    }));

    setSavingQuestion(question.id);

    try {
      await saveResponse({
        participantId,
        section: SECTION,
        questionId: question.id,
        value,
      });

      setLastSaved(new Date());
    } catch (error) {
      console.error(`Could not save ${question.id}:`, error);
    } finally {
      setSavingQuestion(null);
    }
  }

  async function handleContinue() {
    if (!allRequiredAnswered) {
      return;
    }

    await updateParticipantProgress("verification-challenge");

    navigate("/verification-challenge");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading assessment...
      </main>
    );
  }

  return (
    <ResearchPage
      title="Cognitive Engagement"
      subtitle="Think about how mentally involved you were while preparing your argument and responding to the unexpected question."
      backTo="/post-experiment"
      step="Assessment 4"
    >
      <div className="mb-8 rounded-2xl border border-indigo-400/20 bg-indigo-400/5 p-5">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
            <BrainCircuit size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-100">
              Focus on the thinking process
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              We are interested in attention, reasoning, understanding, and how
              actively you processed the task. Answer based on what actually
              happened rather than what you think should have happened.
            </p>
          </div>
        </div>
      </div>

      <div className="sticky top-4 z-20 mb-8 rounded-2xl border border-slate-800 bg-slate-950/95 p-5 shadow-xl backdrop-blur">
        <SurveyProgress current={answeredCount} total={questions.length} />

        <div className="mt-3 flex min-h-5 items-center gap-2 text-xs text-slate-500">
          {savingQuestion ? (
            <>
              <Save size={14} />
              Saving response...
            </>
          ) : lastSaved ? (
            <>
              <CheckCircle2 size={14} className="text-emerald-400" />
              Responses saved automatically
            </>
          ) : (
            <>
              <Save size={14} />
              Answers will be saved automatically
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <LikertQuestion
            key={question.id}
            question={question}
            value={answers[question.id]}
            onChange={(value) => handleAnswer(question, value)}
          />
        ))}
      </div>

      {!allRequiredAnswered && (
        <div className="mt-8 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-100">
          Please answer all statements before continuing.
        </div>
      )}

      <button
        disabled={!allRequiredAnswered}
        onClick={handleContinue}
        className="mt-8 w-full rounded-xl bg-indigo-500 px-6 py-4 font-semibold transition enabled:hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue to Verification Challenge
      </button>
    </ResearchPage>
  );
}

export default CognitiveEngagement;
