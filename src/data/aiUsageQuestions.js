export const aiUsageQuestions = [
  {
    id: "AIU01",
    type: "single",
    category: "general_use",
    question:
      "How often do you use generative AI tools for academic or learning purposes?",
    required: true,
    options: [
      { value: 1, label: "Never" },
      { value: 2, label: "Rarely" },
      { value: 3, label: "Sometimes" },
      { value: 4, label: "Often" },
      { value: 5, label: "Almost every day" },
    ],
  },

  {
    id: "AIU02",
    type: "multi",
    category: "tools",
    question: "Which generative AI tools do you currently use?",
    required: true,
    options: [
      { value: "CHATGPT", label: "ChatGPT" },
      { value: "GEMINI", label: "Google Gemini" },
      { value: "DEEPSEEK", label: "DeepSeek" },
      { value: "COPILOT", label: "Microsoft Copilot" },
      { value: "CLAUDE", label: "Claude" },
      { value: "PERPLEXITY", label: "Perplexity" },
      { value: "OTHER", label: "Other AI tools" },
      { value: "NONE", label: "I do not currently use generative AI" },
    ],
  },

  {
    id: "AIU03",
    type: "multi",
    category: "purpose",
    question: "What do you usually use AI for in your studies?",
    required: true,
    options: [
      { value: "EXPLAIN", label: "Explaining difficult concepts" },
      { value: "SUMMARIZE", label: "Summarizing notes, articles, or chapters" },
      { value: "BRAINSTORM", label: "Brainstorming ideas" },
      { value: "OUTLINE", label: "Creating outlines or structures" },
      { value: "ASSIGNMENT", label: "Helping with assignments" },
      { value: "FULL_ANSWER", label: "Generating complete answers" },
      { value: "EXAM_PREP", label: "Preparing for exams" },
      { value: "QUIZ", label: "Generating quizzes or practice questions" },
      { value: "TRANSLATE", label: "Translation or simplifying English" },
      { value: "GRAMMAR", label: "Grammar and writing correction" },
      {
        value: "RESEARCH",
        label: "Finding or understanding research information",
      },
      { value: "CODING", label: "Programming or debugging" },
      { value: "MATH", label: "Mathematics or problem solving" },
    ],
  },

  {
    id: "AIU04",
    type: "likert",
    category: "learning",
    question: "I use AI to understand topics that I find difficult.",
    required: true,
  },

  {
    id: "AIU05",
    type: "likert",
    category: "learning",
    question:
      "AI helps me learn topics faster than using textbooks or class materials alone.",
    required: true,
  },

  {
    id: "AIU06",
    type: "likert",
    category: "access",
    question: "AI makes difficult learning materials more accessible to me.",
    required: true,
  },

  {
    id: "AIU07",
    type: "likert",
    category: "language",
    question:
      "AI helps me understand academic content when the original material is difficult because of language.",
    required: true,
  },

  {
    id: "AIU08",
    type: "likert",
    category: "productivity",
    question:
      "Using AI reduces the amount of time I need to complete academic tasks.",
    required: true,
  },

  {
    id: "AIU09",
    type: "likert",
    category: "productivity",
    question:
      "AI allows me to spend more time on important parts of a task by handling repetitive work.",
    required: true,
  },

  {
    id: "AIU10",
    type: "likert",
    category: "brainstorming",
    question:
      "When I receive a difficult assignment, I often ask AI for ideas before trying to brainstorm by myself.",
    required: true,
  },

  {
    id: "AIU11",
    type: "likert",
    category: "assignment",
    question: "I use AI when I do not know how to start an assignment.",
    required: true,
  },

  {
    id: "AIU12",
    type: "likert",
    category: "assignment",
    question:
      "I sometimes use AI-generated content directly in academic work with only minor changes.",
    required: true,
  },

  {
    id: "AIU13",
    type: "likert",
    category: "exam",
    question:
      "AI has become an important part of how I prepare for examinations.",
    required: true,
  },

  {
    id: "AIU14",
    type: "likert",
    category: "resources",
    question:
      "Since using AI, I rely less on textbooks or traditional learning materials.",
    required: true,
  },

  {
    id: "AIU15",
    type: "likert",
    category: "verification",
    question:
      "I verify important AI-generated information using another reliable source.",
    required: true,
  },

  {
    id: "AIU16",
    type: "likert",
    category: "verification",
    question:
      "When an AI gives a confident answer, I usually assume that the answer is correct.",
    required: true,
  },

  {
    id: "AIU17",
    type: "likert",
    category: "interaction",
    question:
      "I ask AI follow-up questions until I understand why an answer is correct.",
    required: true,
  },

  {
    id: "AIU18",
    type: "likert",
    category: "interaction",
    question:
      "I use AI to challenge my understanding rather than only asking it for final answers.",
    required: true,
  },

  {
    id: "AIU19",
    type: "single",
    category: "starting_point",
    question:
      "When you face a difficult academic problem, what do you usually do first?",
    required: true,
    options: [
      {
        value: "SELF_FIRST",
        label: "Try to solve or understand it myself first",
      },
      {
        value: "TEXTBOOK_FIRST",
        label: "Check textbook, notes, or another traditional source",
      },
      {
        value: "AI_FIRST",
        label: "Ask an AI tool first",
      },
      {
        value: "PERSON_FIRST",
        label: "Ask a teacher, friend, or another person first",
      },
    ],
  },

  {
    id: "AIU20",
    type: "single",
    category: "confidence",
    question:
      "How confident are you that you could complete your normal academic tasks if AI tools were unavailable for one week?",
    required: true,
    options: [
      { value: 1, label: "Not confident at all" },
      { value: 2, label: "Slightly confident" },
      { value: 3, label: "Moderately confident" },
      { value: 4, label: "Very confident" },
      { value: 5, label: "Completely confident" },
    ],
  },
];

export const likertOptions = [
  {
    value: 1,
    label: "Strongly disagree",
  },
  {
    value: 2,
    label: "Disagree",
  },
  {
    value: 3,
    label: "Neither agree nor disagree",
  },
  {
    value: 4,
    label: "Agree",
  },
  {
    value: 5,
    label: "Strongly agree",
  },
];
