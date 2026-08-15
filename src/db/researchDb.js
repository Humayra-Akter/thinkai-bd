import Dexie from "dexie";

export const db = new Dexie("ThinkAIResearchDB");

db.version(1).stores({
  participants:
    "&id, status, currentStep, educationTrack, assignedGroup, createdAt, updatedAt",

  consents: "&participantId, version, consentedAt",

  demographics:
    "&participantId, educationTrack, classLevel, discipline, institutionType, residenceType, updatedAt",

  responses:
    "[participantId+questionId], participantId, section, questionId, updatedAt, [participantId+section]",

  experimentSessions:
    "&id, participantId, group, status, startedAt, completedAt",

  experimentEvents: "++id, participantId, experimentId, type, timestamp",

  scores: "&participantId, updatedAt",

  settings: "&key",
});
