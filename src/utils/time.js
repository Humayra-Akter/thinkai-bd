export function getRemainingSeconds(endTime) {
  if (!endTime) {
    return 0;
  }

  return Math.max(
    0,
    Math.ceil((new Date(endTime).getTime() - Date.now()) / 1000),
  );
}

export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
}

export function countWords(text = "") {
  const cleaned = text.trim();

  if (!cleaned) {
    return 0;
  }

  return cleaned.split(/\s+/).filter(Boolean).length;
}
