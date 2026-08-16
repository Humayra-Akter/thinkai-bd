import { db } from "../db/researchDb";
import { mainExperimentTask } from "../data/experimentTasks";

const PREPARATION_DURATION = mainExperimentTask.preparationMinutes * 60 * 1000;

const CHALLENGE_DURATION =
  mainExperimentTask.challenge.durationMinutes * 60 * 1000;

function createExperimentId() {
  return `EXP-${crypto
    .randomUUID()
    .replaceAll("-", "")
    .slice(0, 10)
    .toUpperCase()}`;
}

async function logExperimentEvent(
  participantId,
  experimentId,
  type,
  metadata = {},
) {
  await db.experimentEvents.add({
    participantId,
    experimentId,
    type,
    metadata,
    timestamp: new Date().toISOString(),
  });
}

/*
  We keep local group sizes approximately balanced.

  If both groups currently contain the same number
  of participants, the next participant is randomly
  assigned.

  If one group is smaller, the participant is assigned
  to that group.

  This is useful for a small local experiment conducted
  on the same browser/device.
*/
async function chooseGroup() {
  const aiCount = await db.experimentSessions
    .where("group")
    .equals("AI_ASSISTED")
    .count();

  const controlCount = await db.experimentSessions
    .where("group")
    .equals("CONTROL")
    .count();

  if (aiCount < controlCount) {
    return "AI_ASSISTED";
  }

  if (controlCount < aiCount) {
    return "CONTROL";
  }

  const randomArray = new Uint32Array(1);

  crypto.getRandomValues(randomArray);

  return randomArray[0] % 2 === 0 ? "AI_ASSISTED" : "CONTROL";
}

export async function getExperimentForParticipant(participantId) {
  if (!participantId) {
    return null;
  }

  return db.experimentSessions
    .where("participantId")
    .equals(participantId)
    .first();
}

export async function initializeExperiment(participantId) {
  const existing = await getExperimentForParticipant(participantId);

  if (existing) {
    return existing;
  }

  const group = await chooseGroup();

  const experimentId = createExperimentId();

  const now = new Date().toISOString();

  const experiment = {
    id: experimentId,

    participantId,

    taskId: mainExperimentTask.id,

    group,

    status: "READY",

    assignedAt: now,

    startedAt: null,

    preparationEndsAt: null,

    preparationDraft: "",

    preparationSubmittedAt: null,

    challengeStartedAt: null,

    challengeEndsAt: null,

    challengeDraft: "",

    challengeSubmittedAt: null,

    completedAt: null,

    createdAt: now,

    updatedAt: now,
  };

  await db.transaction(
    "rw",

    db.experimentSessions,
    db.participants,
    db.experimentEvents,

    async () => {
      await db.experimentSessions.add(experiment);

      await db.participants.update(participantId, {
        assignedGroup: group,
        currentStep: "experiment-preparation",
        updatedAt: now,
      });

      await logExperimentEvent(participantId, experimentId, "GROUP_ASSIGNED", {
        group,
        taskId: mainExperimentTask.id,
      });
    },
  );

  return experiment;
}

export async function startPreparation(experimentId) {
  const experiment = await db.experimentSessions.get(experimentId);

  if (!experiment) {
    throw new Error("Experiment not found.");
  }

  if (experiment.startedAt) {
    return experiment;
  }

  const now = new Date();

  const preparationEndsAt = new Date(
    now.getTime() + PREPARATION_DURATION,
  ).toISOString();

  await db.experimentSessions.update(experimentId, {
    status: "PREPARATION_ACTIVE",

    startedAt: now.toISOString(),

    preparationEndsAt,

    updatedAt: now.toISOString(),
  });

  await logExperimentEvent(
    experiment.participantId,
    experimentId,
    "PREPARATION_STARTED",
  );

  return db.experimentSessions.get(experimentId);
}

export async function savePreparationDraft(experimentId, draft) {
  await db.experimentSessions.update(experimentId, {
    preparationDraft: draft,

    updatedAt: new Date().toISOString(),
  });
}

export async function submitPreparation(
  experimentId,
  draft,
  reason = "MANUAL",
) {
  const experiment = await db.experimentSessions.get(experimentId);

  if (!experiment) {
    throw new Error("Experiment not found.");
  }

  const now = new Date().toISOString();

  await db.experimentSessions.update(experimentId, {
    preparationDraft: draft,

    preparationSubmittedAt: now,

    status: "PREPARATION_COMPLETE",

    updatedAt: now,
  });

  await logExperimentEvent(
    experiment.participantId,
    experimentId,
    "PREPARATION_SUBMITTED",
    {
      reason,
    },
  );

  return db.experimentSessions.get(experimentId);
}

export async function startChallenge(experimentId) {
  const experiment = await db.experimentSessions.get(experimentId);

  if (!experiment) {
    throw new Error("Experiment not found.");
  }

  if (experiment.challengeStartedAt) {
    return experiment;
  }

  const now = new Date();

  const challengeEndsAt = new Date(
    now.getTime() + CHALLENGE_DURATION,
  ).toISOString();

  await db.experimentSessions.update(experimentId, {
    status: "CHALLENGE_ACTIVE",

    challengeStartedAt: now.toISOString(),

    challengeEndsAt,

    updatedAt: now.toISOString(),
  });

  await logExperimentEvent(
    experiment.participantId,
    experimentId,
    "CHALLENGE_STARTED",
  );

  return db.experimentSessions.get(experimentId);
}

export async function saveChallengeDraft(experimentId, draft) {
  await db.experimentSessions.update(experimentId, {
    challengeDraft: draft,

    updatedAt: new Date().toISOString(),
  });
}

export async function submitChallenge(
  experimentId,
  response,
  reason = "MANUAL",
) {
  const experiment = await db.experimentSessions.get(experimentId);

  if (!experiment) {
    throw new Error("Experiment not found.");
  }

  const now = new Date().toISOString();

  await db.transaction(
    "rw",
    db.experimentSessions,
    db.participants,
    db.experimentEvents,

    async () => {
      await db.experimentSessions.update(experimentId, {
        challengeDraft: response,

        challengeSubmittedAt: now,

        status: "CHALLENGE_COMPLETE",

        updatedAt: now,
      });

      await db.participants.update(experiment.participantId, {
        currentStep: "post-experiment",

        updatedAt: now,
      });

      await logExperimentEvent(
        experiment.participantId,
        experimentId,
        "CHALLENGE_SUBMITTED",
        {
          reason,
        },
      );
    },
  );
}

export function getExperimentRoute(experiment) {
  if (!experiment) {
    return "/experiment-intro";
  }

  switch (experiment.status) {
    case "READY":
    case "PREPARATION_ACTIVE":
      return "/experiment/preparation";

    case "PREPARATION_COMPLETE":
    case "CHALLENGE_ACTIVE":
      return "/experiment/challenge";

    case "CHALLENGE_COMPLETE":
      return "/post-experiment";

    default:
      return "/experiment-intro";
  }
}
