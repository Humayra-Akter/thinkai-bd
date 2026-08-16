import { useEffect, useMemo, useState } from "react";

import { CheckCircle2, FlaskConical, Save } from "lucide-react";

import { useNavigate } from "react-router";

import ResearchPage from "../components/ResearchPage";
import SurveyProgress from "../components/survey/SurveyProgress";
import LikertQuestion from "../components/survey/LikertQuestion";
import SingleChoiceQuestion from "../components/survey/SingleChoiceQuestion";
import MultiChoiceQuestion from "../components/survey/MultiChoiceQuestion";

import {
  aiGroupQuestions,
  commonPostExperimentQuestions,
  controlGroupQuestions,
} from "../data/postExperimentQuestions";

import {
  getActiveParticipantId,
  updateParticipantProgress,
} from "../services/sessionService";

import { getExperimentForParticipant } from "../services/experimentService";

import {
  deleteResponse,
  getSectionResponses,
  saveResponse,
} from "../services/responseService";

const SECTION = "POST_EXPERIMENT";

function PostExperiment() {
  const navigate = useNavigate();

  const participantId = getActiveParticipantId();

  const [experiment, setExperiment] = useState(null);

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
        const currentExperiment =
          await getExperimentForParticipant(participantId);

        if (!currentExperiment) {
          navigate("/experiment-intro", {
            replace: true,
          });

          return;
        }

        if (
          currentExperiment.status !== "CHALLENGE_COMPLETE" &&
          currentExperiment.status !== "COMPLETED"
        ) {
          navigate("/experiment/challenge", {
            replace: true,
          });

          return;
        }

        setExperiment(currentExperiment);

        const stored = await getSectionResponses(participantId, SECTION);

        setAnswers(stored);

        await updateParticipantProgress("post-experiment");
      } catch (error) {
        console.error(
          "Could not initialize post-experiment assessment:",
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [participantId, navigate]);

  const rawQuestions = useMemo(() => {
    if (!experiment) {
      return [];
    }

    const conditionQuestions =
      experiment.group === "AI_ASSISTED"
        ? aiGroupQuestions
        : controlGroupQuestions;

    return [...conditionQuestions, ...commonPostExperimentQuestions];
  }, [experiment]);

  /*
    Conditional questions disappear when
    their prerequisite answer does not match.
  */
  const visibleQuestions = useMemo(() => {
    return rawQuestions
      .filter((question) => {
        if (!question.showWhen) {
          return true;
        }

        return (
          answers[question.showWhen.questionId] === question.showWhen.value
        );
      })
      .map((question, index) => ({
        ...question,
        number: index + 1,
      }));
  }, [rawQuestions, answers]);

  const answeredCount = visibleQuestions.filter((question) => {
    const value = answers[question.id];

    if (question.type === "multi") {
      return Array.isArray(value) && value.length > 0;
    }

    return value !== undefined && value !== null && value !== "";
  }).length;

  const allRequiredAnswered = visibleQuestions
    .filter((question) => question.required)
    .every((question) => {
      const value = answers[question.id];

      if (question.type === "multi") {
        return Array.isArray(value) && value.length > 0;
      }

      return value !== undefined && value !== null && value !== "";
    });

  async function handleAnswer(question, value) {
    const childrenToRemove = rawQuestions.filter(
      (candidate) =>
        candidate.showWhen?.questionId === question.id &&
        candidate.showWhen.value !== value,
    );

    setAnswers((current) => {
      const next = {
        ...current,
        [question.id]: value,
      };

      childrenToRemove.forEach((candidate) => {
        delete next[candidate.id];
      });

      return next;
    });

    setSavingQuestion(question.id);

    try {
      await saveResponse({
        participantId,
        section: SECTION,
        questionId: question.id,
        value,
      });

      await Promise.all(
        childrenToRemove.map((candidate) =>
          deleteResponse(participantId, candidate.id),
        ),
      );

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

    await updateParticipantProgress("cognitive-engagement");

    navigate("/cognitive-engagement");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading assessment...
      </main>
    );
  }

  const isAIGroup = experiment?.group === "AI_ASSISTED";

  return (
    <ResearchPage
      title="Post-Task Assessment"
      subtitle="Please answer based on what actually happened during the experimental task."
      step="Post-experiment"
    >
      <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <h2 className="font-semibold">Experimental task completed</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Your preparation and independent challenge have been saved.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-indigo-400/20 bg-indigo-400/5 p-5">
        <div className="flex gap-4">
          <FlaskConical className="shrink-0 text-indigo-300" />

          <div>
            <h2 className="font-semibold">Answer honestly</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {isAIGroup
                ? "Being assigned to the AI condition does not mean you were required to use AI continuously. Tell us how much you actually used it."
                : "Please tell us whether you followed the independent preparation instructions. An honest answer is more useful to the research than trying to provide an ideal response."}
            </p>
          </div>
        </div>
      </div>

      <div className="sticky top-4 z-20 mb-8 rounded-2xl border border-slate-800 bg-slate-950/95 p-5 shadow-xl backdrop-blur">
        <SurveyProgress
          current={answeredCount}
          total={visibleQuestions.length}
        />

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
        {visibleQuestions.map((question) => {
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
          Please answer all visible questions before continuing.
        </div>
      )}

      <button
        disabled={!allRequiredAnswered}
        onClick={handleContinue}
        className="mt-8 w-full rounded-xl bg-indigo-500 px-6 py-4 font-semibold transition enabled:hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue to Cognitive Engagement
      </button>
    </ResearchPage>
  );
}

export default PostExperiment;
