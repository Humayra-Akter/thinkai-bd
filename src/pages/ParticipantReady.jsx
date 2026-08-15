import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ResearchPage from "../components/ResearchPage";

import { db } from "../db/researchDb";

import { getActiveParticipantId } from "../services/sessionService";

function ParticipantReady() {
  const [participant, setParticipant] = useState(null);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadData() {
      const id = getActiveParticipantId();

      if (!id) return;

      const participantData = await db.participants.get(id);

      const demographicData = await db.demographics.get(id);

      setParticipant(participantData);
      setProfile(demographicData);
    }

    loadData();
  }, []);

  return (
    <ResearchPage
      title="Participant Created"
      subtitle="The local research database is working correctly."
      backTo="/participant-setup"
      step="Setup complete"
    >
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
        <div className="text-sm text-emerald-300">Participant ID</div>

        <div className="mt-2 text-2xl font-bold">
          {participant?.id || "Loading..."}
        </div>
      </div>

      {profile && (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold">Stored Profile</h2>

          <div className="mt-5 space-y-3 text-sm">
            <Row label="Education" value={profile.educationTrack} />

            <Row label="Class" value={profile.classLevel || "—"} />

            <Row label="Discipline" value={profile.discipline || "—"} />

            <Row label="Institution" value={profile.institutionType} />

            <Row label="Location" value={profile.residenceType} />

            <Row label="AI Access" value={profile.aiAccess} />
          </div>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-indigo-400/20 bg-indigo-400/5 p-6">
        <h2 className="font-semibold text-indigo-200">Ready to begin?</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          The first assessment examines how you currently use generative AI for
          learning, assignments, exams, brainstorming, and verification.
        </p>

        <button
          onClick={() => navigate("/ai-usage")}
          className="mt-5 w-full rounded-xl bg-indigo-500 px-6 py-4 font-semibold text-white transition hover:bg-indigo-400"
        >
          Begin AI Usage Assessment
        </button>
      </div>
    </ResearchPage>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-800 pb-3">
      <span className="text-slate-400">{label}</span>

      <span className="font-medium">{value}</span>
    </div>
  );
}

export default ParticipantReady;
