import { useEffect, useMemo, useState } from "react";

import { Brain, CheckCircle2, Save } from "lucide-react";

import { useNavigate } from "react-router";

import ResearchPage from "../components/ResearchPage";
import SurveyProgress from "../components/survey/SurveyProgress";
import LikertQuestion from "../components/survey/LikertQuestion";

import { dependencyQuestions } from "../data/dependencyQuestions";

import {
  getActiveParticipantId,
  updateParticipantProgress,
} from "../services/sessionService";

import { getSectionResponses, saveResponse } from "../services/responseService";

const SECTION = "AI_DEPENDENCY";

function DependencyAssessment() {
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

        await updateParticipantProgress("dependency");
      } catch (error) {
        console.error("Could not load dependency assessment:", error);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [participantId, navigate]);

  const questions = useMemo(
    () =>
      dependencyQuestions.map((question, index) => ({
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

    await updateParticipantProgress("experiment-intro");

    navigate("/experiment-intro");
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
      title="AI Reliance & Independent Learning"
      subtitle="Think about how you normally respond when academic work becomes difficult, especially when AI support is unavailable."
      backTo="/cognitive-offloading"
      step="Assessment 3"
    >
      <div className="mb-8 rounded-2xl border border-indigo-400/20 bg-indigo-400/5 p-5">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
            <Brain size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-100">
              Focus on your actual behaviour
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Consider what usually happens when you become stuck, when AI is
              unavailable, or when you need to reproduce something you
              previously learned with AI.
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
        Continue to Experimental Task
      </button>
    </ResearchPage>
  );
}

export default DependencyAssessment;
