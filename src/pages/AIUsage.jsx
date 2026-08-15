import { useEffect, useMemo, useState } from "react";

import { CheckCircle2, Save } from "lucide-react";

import { useNavigate } from "react-router";

import ResearchPage from "../components/ResearchPage";
import SurveyProgress from "../components/survey/SurveyProgress";
import LikertQuestion from "../components/survey/LikertQuestion";
import SingleChoiceQuestion from "../components/survey/SingleChoiceQuestion";
import MultiChoiceQuestion from "../components/survey/MultiChoiceQuestion";

import { aiUsageQuestions } from "../data/aiUsageQuestions";

import {
  getActiveParticipantId,
  updateParticipantProgress,
} from "../services/sessionService";

import { getSectionResponses, saveResponse } from "../services/responseService";

const SECTION = "AI_USAGE";

function AIUsage() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(true);

  const [savingQuestion, setSavingQuestion] = useState(null);

  const [lastSaved, setLastSaved] = useState(null);

  const participantId = getActiveParticipantId();

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

        await updateParticipantProgress("ai-usage");
      } catch (error) {
        console.error("Could not load AI usage responses:", error);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [participantId, navigate]);

  const questions = useMemo(
    () =>
      aiUsageQuestions.map((question, index) => ({
        ...question,
        number: index + 1,
      })),
    [],
  );

  const answeredCount = questions.filter((question) => {
    const value = answers[question.id];

    if (question.type === "multi") {
      return Array.isArray(value) && value.length > 0;
    }

    return value !== undefined && value !== null && value !== "";
  }).length;

  const allRequiredAnswered = questions
    .filter((question) => question.required)
    .every((question) => {
      const value = answers[question.id];

      if (question.type === "multi") {
        return Array.isArray(value) && value.length > 0;
      }

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

    await updateParticipantProgress("cognitive-offloading");

    navigate("/cognitive-offloading");
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
      title="AI Usage & Learning Behaviour"
      subtitle="Tell us how you currently use generative AI in your normal learning activities. There are no right or wrong answers."
      backTo="/participant-ready"
      step="Assessment 1"
    >
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
        {questions.map((question) => {
          const commonProps = {
            key: question.id,
            question,
            value: answers[question.id],
            onChange: (value) => handleAnswer(question, value),
          };

          if (question.type === "likert") {
            return <LikertQuestion {...commonProps} />;
          }

          if (question.type === "multi") {
            return <MultiChoiceQuestion {...commonProps} />;
          }

          return <SingleChoiceQuestion {...commonProps} />;
        })}
      </div>

      {!allRequiredAnswered && (
        <div className="mt-8 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-100">
          Please answer all required questions before continuing.
        </div>
      )}

      <button
        disabled={!allRequiredAnswered}
        onClick={handleContinue}
        className="mt-8 w-full rounded-xl bg-indigo-500 px-6 py-4 font-semibold transition enabled:hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue to Cognitive Offloading
      </button>
    </ResearchPage>
  );
}

export default AIUsage;
