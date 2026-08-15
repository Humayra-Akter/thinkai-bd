import { Brain, Sparkles, ShieldCheck } from "lucide-react";

import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20">
        <div className="w-full max-w-5xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-200">
            <Sparkles size={16} />
            AI Learning Research • Bangladesh
          </div>

          <h1 className="max-w-5xl text-5xl font-bold tracking-tight md:text-7xl">
            AI as a <span className="text-indigo-400">Tutor</span> or a{" "}
            <span className="text-amber-400">Crutch?</span>
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-9 text-slate-300">
            An interactive research platform investigating how generative AI
            affects productivity, cognitive offloading, dependency, verification
            behaviour, and independent thinking among students in Bangladesh.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/research-info")}
              className="rounded-xl bg-indigo-500 px-7 py-3.5 font-semibold transition hover:bg-indigo-400"
            >
              Start Research Assessment
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl border border-slate-700 px-7 py-3.5 font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Researcher Dashboard
            </button>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            <Feature
              icon={<Brain size={20} />}
              title="Cognitive Engagement"
              text="Measure how much thinking students retain when using AI."
            />

            <Feature
              icon={<Sparkles size={20} />}
              title="AI Productivity"
              text="Measure where AI genuinely improves learning and access."
            />

            <Feature
              icon={<ShieldCheck size={20} />}
              title="Research Data"
              text="Locally stored experimental and questionnaire results."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-indigo-300">
        {icon}
      </div>

      <h2 className="font-semibold">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

export default Home;
