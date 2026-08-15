import { useState } from "react";
import { useNavigate } from "react-router";

import ResearchPage from "../components/ResearchPage";

import { startParticipantSession } from "../services/sessionService";

function Consent() {
  const navigate = useNavigate();

  const [readInfo, setReadInfo] = useState(false);

  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);

  const canContinue = readInfo && agree && !loading;

  async function handleConsent() {
    if (!canContinue) return;

    try {
      setLoading(true);

      await startParticipantSession();

      navigate("/participant-setup");
    } catch (error) {
      console.error("Could not create participant:", error);

      alert("The participant session could not be created.");

      setLoading(false);
    }
  }

  return (
    <ResearchPage
      title="Participation Consent"
      subtitle="Participation should be voluntary. Please confirm the following before continuing."
      backTo="/research-info"
      step="Consent"
    >
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold">Participation</h2>

        <p className="mt-3 text-sm leading-7 text-slate-400">
          Your responses will be used to examine patterns of AI use, cognitive
          engagement, academic dependency, verification behaviour, and learning
          performance.
        </p>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          This prototype does not require your personal name, email address,
          phone number, or student ID.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <ConsentOption checked={readInfo} onChange={setReadInfo}>
          I have read the participant information above and understand what the
          study involves.
        </ConsentOption>

        <ConsentOption checked={agree} onChange={setAgree}>
          I voluntarily agree to participate in this research assessment.
        </ConsentOption>
      </div>

      <button
        disabled={!canContinue}
        onClick={handleConsent}
        className="mt-8 w-full rounded-xl bg-indigo-500 px-6 py-4 font-semibold transition enabled:hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Creating Participant..." : "I Agree — Begin Assessment"}
      </button>
    </ResearchPage>
  );
}

function ConsentOption({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 accent-indigo-500"
      />

      <span className="text-sm leading-6 text-slate-300">{children}</span>
    </label>
  );
}

export default Consent;
