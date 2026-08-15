function SurveyProgress({ current, total }) {
  const percentage = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-400">Progress</span>

        <span className="font-medium text-slate-200">{percentage}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="mt-2 text-xs text-slate-500">
        {current} of {total} questions answered
      </div>
    </div>
  );
}

export default SurveyProgress;
