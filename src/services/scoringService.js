import { db } from "../db/researchDb";

import { aiUsageQuestions } from "../data/aiUsageQuestions";

import { cognitiveOffloadingQuestions } from "../data/cognitiveOffloadingQuestions";

import { dependencyQuestions } from "../data/dependencyQuestions";

import { cognitiveEngagementQuestions } from "../data/cognitiveEngagementQuestions";

import { verificationItems } from "../data/verificationItems";

const SCORE_VERSION = "thinkai-project-v1";

function round(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }

  return Number(Number(value).toFixed(digits));
}

function mean(values = []) {
  const valid = values.map(Number).filter((value) => Number.isFinite(value));

  if (!valid.length) {
    return null;
  }

  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function reverseFive(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return null;
  }

  return 6 - numeric;
}

function scaleFiveToPercent(average) {
  if (average === null || average === undefined) {
    return null;
  }

  /*
    1 = 0%
    3 = 50%
    5 = 100%
  */

  return round(((average - 1) / 4) * 100, 1);
}

function countWords(text = "") {
  const cleaned = String(text).trim();

  if (!cleaned) {
    return 0;
  }

  return cleaned.split(/\s+/).filter(Boolean).length;
}

function durationSeconds(start, end) {
  if (!start || !end) {
    return null;
  }

  const difference = new Date(end).getTime() - new Date(start).getTime();

  if (Number.isNaN(difference)) {
    return null;
  }

  return Math.max(0, Math.round(difference / 1000));
}

function buildResponseMap(rows) {
  const result = {};

  rows.forEach((row) => {
    if (!result[row.section]) {
      result[row.section] = {};
    }

    result[row.section][row.questionId] = row.value;
  });

  return result;
}

function getValue(map, section, questionId) {
  return map?.[section]?.[questionId];
}

function getQuestionMean(map, section, ids, reverseIds = []) {
  const values = ids.map((id) => {
    const value = getValue(map, section, id);

    if (reverseIds.includes(id)) {
      return reverseFive(value);
    }

    return Number(value);
  });

  return mean(values);
}

function calculateAIUsage(responses) {
  const section = "AI_USAGE";

  /*
    Productivity + accessibility
  */
  const productivityMean = getQuestionMean(responses, section, [
    "AIU05",
    "AIU06",
    "AIU07",
    "AIU08",
    "AIU09",
  ]);

  /*
    Higher = stronger verification behaviour.
    AIU16 is reversed because agreeing with it
    indicates blind confidence in AI.
  */
  const verificationMean = getQuestionMean(
    responses,
    section,
    ["AIU15", "AIU16"],
    ["AIU16"],
  );

  /*
    Asking follow-up questions and using AI
    to challenge understanding.
  */
  const socraticMean = getQuestionMean(responses, section, ["AIU17", "AIU18"]);

  /*
    This is exploratory, not a validated scale.
  */
  const delegationMean = getQuestionMean(responses, section, [
    "AIU10",
    "AIU11",
    "AIU12",
    "AIU13",
    "AIU14",
  ]);

  return {
    productivityAccess: {
      mean: round(productivityMean),

      percent: scaleFiveToPercent(productivityMean),
    },

    verificationTendency: {
      mean: round(verificationMean),

      percent: scaleFiveToPercent(verificationMean),
    },

    socraticUse: {
      mean: round(socraticMean),

      percent: scaleFiveToPercent(socraticMean),
    },

    delegationTendency: {
      mean: round(delegationMean),

      percent: scaleFiveToPercent(delegationMean),
    },
  };
}

function calculateOffloading(responses) {
  const section = "COGNITIVE_OFFLOADING";

  const lowerIds = cognitiveOffloadingQuestions
    .filter((question) => question.construct === "LOWER_ORDER")
    .map((question) => question.id);

  const higherIds = cognitiveOffloadingQuestions
    .filter((question) => question.construct === "HIGHER_ORDER")
    .map((question) => question.id);

  const lowerMean = getQuestionMean(responses, section, lowerIds);

  const higherMean = getQuestionMean(responses, section, higherIds);

  return {
    lowerOrder: {
      mean: round(lowerMean),

      percent: scaleFiveToPercent(lowerMean),
    },

    higherOrder: {
      mean: round(higherMean),

      percent: scaleFiveToPercent(higherMean),
    },
  };
}

function calculateDependency(responses) {
  const section = "AI_DEPENDENCY";

  /*
    For overall dependency risk:
    positive/protective statements are reversed.

    Therefore:
    higher score = greater dependency risk.
  */

  const riskScores = dependencyQuestions.map((question) => {
    const raw = getValue(responses, section, question.id);

    if (raw === undefined) {
      return null;
    }

    return question.reverseScored ? reverseFive(raw) : Number(raw);
  });

  const dependencyRiskMean = mean(riskScores);

  /*
    Positive independent-learning indicators.
  */

  const staminaMean = getQuestionMean(responses, section, ["DEP02", "DEP05"]);

  const understandingMean = getQuestionMean(responses, section, [
    "DEP07",
    "DEP09",
  ]);

  const controlMean = getQuestionMean(responses, section, ["DEP10", "DEP12"]);

  return {
    dependencyRisk: {
      mean: round(dependencyRiskMean),

      percent: scaleFiveToPercent(dependencyRiskMean),
    },

    metacognitiveStamina: {
      mean: round(staminaMean),

      percent: scaleFiveToPercent(staminaMean),
    },

    independentUnderstanding: {
      mean: round(understandingMean),

      percent: scaleFiveToPercent(understandingMean),
    },

    metacognitiveControl: {
      mean: round(controlMean),

      percent: scaleFiveToPercent(controlMean),
    },
  };
}

function calculateEngagement(responses) {
  const section = "COGNITIVE_ENGAGEMENT";

  const values = cognitiveEngagementQuestions.map((question) => {
    const raw = getValue(responses, section, question.id);

    if (raw === undefined) {
      return null;
    }

    return question.reverseScored ? reverseFive(raw) : Number(raw);
  });

  const overallMean = mean(values);

  function constructMean(construct) {
    const questions = cognitiveEngagementQuestions.filter(
      (question) => question.construct === construct,
    );

    return mean(
      questions.map((question) => {
        const raw = getValue(responses, section, question.id);

        if (raw === undefined) {
          return null;
        }

        return question.reverseScored ? reverseFive(raw) : Number(raw);
      }),
    );
  }

  const attention = constructMean("ATTENTION");

  const deepProcessing = constructMean("DEEP_PROCESSING");

  const activeReasoning = constructMean("ACTIVE_REASONING");

  const independentReasoning = constructMean("INDEPENDENT_REASONING");

  return {
    overall: {
      mean: round(overallMean),

      percent: scaleFiveToPercent(overallMean),
    },

    attention: {
      mean: round(attention),

      percent: scaleFiveToPercent(attention),
    },

    deepProcessing: {
      mean: round(deepProcessing),

      percent: scaleFiveToPercent(deepProcessing),
    },

    activeReasoning: {
      mean: round(activeReasoning),

      percent: scaleFiveToPercent(activeReasoning),
    },

    independentReasoning: {
      mean: round(independentReasoning),

      percent: scaleFiveToPercent(independentReasoning),
    },
  };
}

function calculateVerification(responses) {
  const section = "VERIFICATION_CHALLENGE";

  let correct = 0;
  let answered = 0;

  let verifyActions = 0;
  let acceptActions = 0;

  let incorrectAIAnswers = 0;

  let acceptedIncorrectAI = 0;

  let confidentWrong = 0;

  verificationItems.forEach((item) => {
    const judgment = getValue(responses, section, `${item.id}_JUDGMENT`);

    const confidence = Number(
      getValue(responses, section, `${item.id}_CONFIDENCE`),
    );

    const action = getValue(responses, section, `${item.id}_ACTION`);

    if (judgment !== undefined) {
      answered += 1;

      if (judgment === item.correctStatus) {
        correct += 1;
      } else if (Number.isFinite(confidence) && confidence >= 4) {
        confidentWrong += 1;
      }
    }

    if (action === "VERIFY") {
      verifyActions += 1;
    }

    if (action === "ACCEPT") {
      acceptActions += 1;
    }

    if (item.correctStatus === "INCORRECT") {
      incorrectAIAnswers += 1;

      if (action === "ACCEPT") {
        acceptedIncorrectAI += 1;
      }
    }
  });

  const accuracy = answered ? (correct / answered) * 100 : null;

  const verificationRate = verificationItems.length
    ? (verifyActions / verificationItems.length) * 100
    : null;

  const blindAcceptanceRate = incorrectAIAnswers
    ? (acceptedIncorrectAI / incorrectAIAnswers) * 100
    : null;

  return {
    correct,
    total: answered,

    accuracyPercent: round(accuracy, 1),

    verificationActionPercent: round(verificationRate, 1),

    blindAcceptancePercent: round(blindAcceptanceRate, 1),

    confidentWrongCount: confidentWrong,

    acceptActionCount: acceptActions,
  };
}

function calculatePostExperiment(responses) {
  const section = "POST_EXPERIMENT";

  return {
    preparationEffort: Number(getValue(responses, section, "POST01")) || null,

    challengeEffort: Number(getValue(responses, section, "POST02")) || null,

    preparationDifficulty:
      Number(getValue(responses, section, "POST03")) || null,

    challengeDifficulty: Number(getValue(responses, section, "POST04")) || null,

    preparationConfidence:
      Number(getValue(responses, section, "POST05")) || null,

    challengeConfidence: Number(getValue(responses, section, "POST06")) || null,

    actuallyUsedAI: getValue(responses, section, "MAN01") ?? null,

    aiReliance: Number(getValue(responses, section, "MAN03")) || null,

    controlViolation: getValue(responses, section, "MAN06") ?? null,
  };
}

function calculateLearningPattern({ usage, offloading, dependency }) {
  const socratic = usage.socraticUse.percent;

  const verification = usage.verificationTendency.percent;

  const higherOffloading = offloading.higherOrder.percent;

  const dependencyRisk = dependency.dependencyRisk.percent;

  const tutorValues = [
    socratic,
    verification,
    higherOffloading !== null ? 100 - higherOffloading : null,

    dependencyRisk !== null ? 100 - dependencyRisk : null,
  ].filter((value) => value !== null && value !== undefined);

  const tutorScore = tutorValues.length ? mean(tutorValues) : null;

  const delegationValues = [
    higherOffloading,
    dependencyRisk,
    usage.delegationTendency.percent,
  ].filter((value) => value !== null && value !== undefined);

  const delegationRisk = delegationValues.length
    ? mean(delegationValues)
    : null;

  let label = "Mixed AI Learning Pattern";

  let description =
    "Your responses show a mixture of independent thinking and AI-supported delegation.";

  if (tutorScore >= 65 && delegationRisk < 55) {
    label = "Tutor-Oriented AI Use";

    description =
      "You tend to use AI more as a support for understanding, verification, and learning while retaining substantial independent cognitive work.";
  } else if (delegationRisk >= 65 && tutorScore < 55) {
    label = "High-Delegation AI Use";

    description =
      "You frequently delegate important parts of academic thinking to AI. This does not mean your AI use is inherently harmful, but it suggests that preserving opportunities for independent reasoning may be important.";
  } else if (tutorScore >= 60 && delegationRisk >= 55) {
    label = "High-Use Mixed Pattern";

    description =
      "You use AI actively for both learning support and cognitive delegation. Your pattern may depend strongly on the type of task.";
  }

  return {
    tutorOrientationPercent: round(tutorScore, 1),

    delegationRiskPercent: round(delegationRisk, 1),

    label,

    description,
  };
}

export async function calculateResearchScores(participantId) {
  if (!participantId) {
    throw new Error("participantId is required.");
  }

  const [rows, experiment] = await Promise.all([
    db.responses.where("participantId").equals(participantId).toArray(),

    db.experimentSessions.where("participantId").equals(participantId).first(),
  ]);

  const responses = buildResponseMap(rows);

  const usage = calculateAIUsage(responses);

  const offloading = calculateOffloading(responses);

  const dependency = calculateDependency(responses);

  const engagement = calculateEngagement(responses);

  const verification = calculateVerification(responses);

  const postExperiment = calculatePostExperiment(responses);

  const learningPattern = calculateLearningPattern({
    usage,
    offloading,
    dependency,
  });

  const experimentMetrics = experiment
    ? {
        group: experiment.group,

        preparationWords: countWords(experiment.preparationDraft),

        challengeWords: countWords(experiment.challengeDraft),

        preparationDurationSeconds: durationSeconds(
          experiment.startedAt,
          experiment.preparationSubmittedAt,
        ),

        challengeDurationSeconds: durationSeconds(
          experiment.challengeStartedAt,
          experiment.challengeSubmittedAt,
        ),
      }
    : null;

  const result = {
    participantId,

    scoreVersion: SCORE_VERSION,

    generatedAt: new Date().toISOString(),

    usage,

    offloading,

    dependency,

    engagement,

    verification,

    postExperiment,

    experiment: experimentMetrics,

    learningPattern,
  };

  await db.scores.put({
    participantId,

    ...result,

    updatedAt: new Date().toISOString(),
  });

  return result;
}

export async function getSavedScores(participantId) {
  return db.scores.get(participantId);
}
