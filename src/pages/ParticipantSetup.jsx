import { useEffect, useState } from "react";

import { useNavigate } from "react-router";

import ResearchPage from "../components/ResearchPage";

import {
  getActiveParticipantId,
  saveDemographics,
} from "../services/sessionService";

const initialForm = {
  educationTrack: "",
  classLevel: "",
  discipline: "",
  institutionType: "",
  residenceType: "",
  aiAccess: "",
};

function ParticipantSetup() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!getActiveParticipantId()) {
      navigate("/consent", {
        replace: true,
      });
    }
  }, [navigate]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  const isSchool = form.educationTrack === "SCHOOL";

  const isUniversity = form.educationTrack === "UNIVERSITY";

  const valid =
    form.educationTrack &&
    form.institutionType &&
    form.residenceType &&
    form.aiAccess &&
    ((isSchool && form.classLevel) || (isUniversity && form.discipline));

  async function handleSubmit(event) {
    event.preventDefault();

    if (!valid) return;

    try {
      setSaving(true);

      await saveDemographics(form);

      navigate("/participant-ready");
    } catch (error) {
      console.error(error);

      alert("Participant information could not be saved.");

      setSaving(false);
    }
  }

  return (
    <ResearchPage
      title="Participant Profile"
      subtitle="This information helps us compare different learning environments and student groups."
      backTo="/consent"
      step="Participant setup"
    >
      <form onSubmit={handleSubmit} className="space-y-7">
        <Question label="Which education group best describes you?">
          <div className="grid gap-3 sm:grid-cols-2">
            <ChoiceButton
              active={form.educationTrack === "SCHOOL"}
              onClick={() => updateField("educationTrack", "SCHOOL")}
            >
              Class 8–12
            </ChoiceButton>

            <ChoiceButton
              active={form.educationTrack === "UNIVERSITY"}
              onClick={() => updateField("educationTrack", "UNIVERSITY")}
            >
              University
            </ChoiceButton>
          </div>
        </Question>

        {isSchool && (
          <Question label="Current class">
            <Select
              value={form.classLevel}
              onChange={(value) => updateField("classLevel", value)}
            >
              <option value="">Select class</option>

              <option value="8">Class 8</option>

              <option value="9">Class 9</option>

              <option value="10">Class 10</option>

              <option value="11">Class 11</option>

              <option value="12">Class 12</option>
            </Select>
          </Question>
        )}

        {isUniversity && (
          <Question label="Area of study">
            <Select
              value={form.discipline}
              onChange={(value) => updateField("discipline", value)}
            >
              <option value="">Select discipline</option>

              <option value="ENGINEERING">Engineering / Technology</option>

              <option value="MEDICAL">Medical / Health Sciences</option>

              <option value="BUSINESS">Business</option>

              <option value="SCIENCE">Science</option>

              <option value="SOCIAL_SCIENCE">Social Sciences</option>

              <option value="HUMANITIES">Humanities</option>

              <option value="OTHER">Other</option>
            </Select>
          </Question>
        )}

        <Question label="Institution type">
          <Select
            value={form.institutionType}
            onChange={(value) => updateField("institutionType", value)}
          >
            <option value="">Select institution type</option>

            <option value="PUBLIC">Public</option>

            <option value="PRIVATE">Private</option>

            <option value="OTHER">Other</option>
          </Select>
        </Question>

        <Question label="Where do you mainly live/study?">
          <Select
            value={form.residenceType}
            onChange={(value) => updateField("residenceType", value)}
          >
            <option value="">Select location</option>

            <option value="DHAKA">Dhaka</option>

            <option value="OTHER_CITY">Other city / urban area</option>

            <option value="SEMI_URBAN">Semi-urban</option>

            <option value="RURAL">Rural</option>
          </Select>
        </Question>

        <Question label="What type of generative AI access do you normally have?">
          <Select
            value={form.aiAccess}
            onChange={(value) => updateField("aiAccess", value)}
          >
            <option value="">Select AI access</option>

            <option value="NONE">I do not normally use AI</option>

            <option value="FREE">Free AI tools / free plans</option>

            <option value="PAID_SHARED">Shared access to paid AI</option>

            <option value="PAID_PERSONAL">Personal paid AI subscription</option>
          </Select>
        </Question>

        <button
          disabled={!valid || saving}
          type="submit"
          className="w-full rounded-xl bg-indigo-500 px-6 py-4 font-semibold transition enabled:hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Saving..." : "Continue"}
        </button>
      </form>
    </ResearchPage>
  );
}

function Question({ label, children }) {
  return (
    <div>
      <label className="mb-3 block font-medium">{label}</label>

      {children}
    </div>
  );
}

function ChoiceButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? "border-indigo-400 bg-indigo-500/10 text-indigo-200"
          : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
      }`}
    >
      {children}
    </button>
  );
}

function Select({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-white outline-none transition focus:border-indigo-400"
    >
      {children}
    </select>
  );
}

export default ParticipantSetup;
