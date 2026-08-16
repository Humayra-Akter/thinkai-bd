import { db } from "../db/researchDb";

export async function saveResponse({
  participantId,
  section,
  questionId,
  value,
}) {
  if (!participantId) {
    throw new Error("participantId is required.");
  }

  const now = new Date().toISOString();

  await db.responses.put({
    participantId,
    section,
    questionId,
    value,
    updatedAt: now,
  });
}

export async function getSectionResponses(participantId, section) {
  if (!participantId) {
    return {};
  }

  const rows = await db.responses
    .where("[participantId+section]")
    .equals([participantId, section])
    .toArray();

  return rows.reduce((result, row) => {
    result[row.questionId] = row.value;
    return result;
  }, {});
}

export async function getAllParticipantResponses(participantId) {
  return db.responses.where("participantId").equals(participantId).toArray();
}

export async function deleteResponse(participantId, questionId) {
  await db.responses.delete([participantId, questionId]);
}