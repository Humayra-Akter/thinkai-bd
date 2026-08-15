import { db } from "../db/researchDb";

const ACTIVE_PARTICIPANT_KEY = "thinkai_active_participant";
const ACTIVE_STEP_KEY = "thinkai_active_step";

function createParticipantId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");

  const randomPart = crypto
    .randomUUID()
    .replaceAll("-", "")
    .slice(0, 6)
    .toUpperCase();

  return `TA-${date}-${randomPart}`;
}

export async function startParticipantSession() {
  const participantId = createParticipantId();
  const now = new Date().toISOString();

  await db.transaction("rw", db.participants, db.consents, async () => {
    await db.participants.add({
      id: participantId,
      status: "ACTIVE",
      currentStep: "participant-setup",

      educationTrack: null,

      assignedGroup: null,

      createdAt: now,
      updatedAt: now,
    });

    await db.consents.put({
      participantId,
      version: "prototype-v1",
      voluntarilyAgreed: true,
      consentedAt: now,
    });
  });

  localStorage.setItem(ACTIVE_PARTICIPANT_KEY, participantId);

  localStorage.setItem(ACTIVE_STEP_KEY, "participant-setup");

  return participantId;
}

export function getActiveParticipantId() {
  return localStorage.getItem(ACTIVE_PARTICIPANT_KEY);
}

export function getActiveStep() {
  return localStorage.getItem(ACTIVE_STEP_KEY);
}

export async function getActiveParticipant() {
  const participantId = getActiveParticipantId();

  if (!participantId) {
    return null;
  }

  return db.participants.get(participantId);
}

export async function updateParticipantProgress(step) {
  const participantId = getActiveParticipantId();

  if (!participantId) {
    throw new Error("No active participant session.");
  }

  const now = new Date().toISOString();

  await db.participants.update(participantId, {
    currentStep: step,
    updatedAt: now,
  });

  localStorage.setItem(ACTIVE_STEP_KEY, step);
}

export async function saveDemographics(data) {
  const participantId = getActiveParticipantId();

  if (!participantId) {
    throw new Error("No active participant session.");
  }

  const now = new Date().toISOString();

  await db.transaction("rw", db.demographics, db.participants, async () => {
    await db.demographics.put({
      participantId,
      ...data,
      updatedAt: now,
    });

    await db.participants.update(participantId, {
      educationTrack: data.educationTrack,
      currentStep: "ai-usage",
      updatedAt: now,
    });
  });

  localStorage.setItem(ACTIVE_STEP_KEY, "ai-usage");
}

export async function clearActiveSession() {
  localStorage.removeItem(ACTIVE_PARTICIPANT_KEY);

  localStorage.removeItem(ACTIVE_STEP_KEY);
}
