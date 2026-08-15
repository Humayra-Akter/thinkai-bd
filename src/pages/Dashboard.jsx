import { useEffect, useState } from "react";

import { useNavigate } from "react-router";

import { ArrowLeft, Database, Users } from "lucide-react";

import { db } from "../db/researchDb";

function Dashboard() {
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    loadParticipants();
  }, []);

  async function loadParticipants() {
    const data = await db.participants.orderBy("createdAt").reverse().toArray();

    setParticipants(data);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={17} />
          Home
        </button>

        <div className="mt-8">
          <div className="flex items-center gap-3">
            <Database className="text-indigo-400" />

            <h1 className="text-3xl font-bold">Researcher Dashboard</h1>
          </div>

          <p className="mt-3 text-slate-400">
            Local research dataset stored on this browser.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Users />}
            label="Participants"
            value={participants.length}
          />

          <StatCard
            label="Completed"
            value={
              participants.filter((item) => item.status === "COMPLETED").length
            }
          />

          <StatCard
            label="Active"
            value={
              participants.filter((item) => item.status === "ACTIVE").length
            }
          />
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-800">
          <div className="border-b border-slate-800 bg-slate-900 px-5 py-4 font-semibold">
            Participant Sessions
          </div>

          {participants.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No participants have been recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="grid gap-2 bg-slate-900/40 px-5 py-4 md:grid-cols-4"
                >
                  <span className="font-medium">{participant.id}</span>

                  <span className="text-slate-400">
                    {participant.educationTrack || "Not specified"}
                  </span>

                  <span className="text-slate-400">
                    {participant.currentStep}
                  </span>

                  <span className="text-slate-400 md:text-right">
                    {participant.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        {icon}
        {label}
      </div>

      <div className="mt-3 text-3xl font-bold">{value}</div>
    </div>
  );
}

export default Dashboard;
