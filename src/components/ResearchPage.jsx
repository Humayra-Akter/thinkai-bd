import { ArrowLeft, Brain } from "lucide-react";

import { useNavigate } from "react-router";

function ResearchPage({ children, title, subtitle, backTo = "/", step }) {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-semibold"
          >
            <Brain className="text-indigo-400" />
            ThinkAI BD
          </button>

          {step && <span className="text-sm text-slate-400">{step}</span>}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <button
          onClick={() => navigate(backTo)}
          className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>

        {subtitle && (
          <p className="mt-4 leading-7 text-slate-400">{subtitle}</p>
        )}

        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}

export default ResearchPage;
