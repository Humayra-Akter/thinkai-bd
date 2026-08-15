import ResearchPage from "../components/ResearchPage";

function CognitiveOffloading() {
  return (
    <ResearchPage
      title="Cognitive Offloading"
      subtitle="This is the next assessment module."
      backTo="/ai-usage"
      step="Assessment 2"
    >
      <div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/5 p-6">
        <h2 className="font-semibold text-indigo-200">
          AI Usage Assessment Complete
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Your responses have been saved locally. The next module will measure
          which types of cognitive tasks you delegate to AI.
        </p>
      </div>
    </ResearchPage>
  );
}

export default CognitiveOffloading;
