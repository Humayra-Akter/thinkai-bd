export const commonPostExperimentQuestions = [
  {
    id: "POST01",
    type: "single",
    construct: "MENTAL_EFFORT",
    question:
      "How much mental effort did you put into preparing your original argument?",
    required: true,
    options: [
      { value: 1, label: "Very little effort" },
      { value: 2, label: "Little effort" },
      { value: 3, label: "Moderate effort" },
      { value: 4, label: "High effort" },
      { value: 5, label: "Very high effort" },
    ],
  },

  {
    id: "POST02",
    type: "single",
    construct: "MENTAL_EFFORT",
    question:
      "How much mental effort did you put into answering the unexpected question?",
    required: true,
    options: [
      { value: 1, label: "Very little effort" },
      { value: 2, label: "Little effort" },
      { value: 3, label: "Moderate effort" },
      { value: 4, label: "High effort" },
      { value: 5, label: "Very high effort" },
    ],
  },

  {
    id: "POST03",
    type: "single",
    construct: "TASK_DIFFICULTY",
    question: "How difficult did you find the preparation task?",
    required: true,
    options: [
      { value: 1, label: "Very easy" },
      { value: 2, label: "Easy" },
      { value: 3, label: "Moderate" },
      { value: 4, label: "Difficult" },
      { value: 5, label: "Very difficult" },
    ],
  },

  {
    id: "POST04",
    type: "single",
    construct: "TASK_DIFFICULTY",
    question: "How difficult did you find the unexpected independent question?",
    required: true,
    options: [
      { value: 1, label: "Very easy" },
      { value: 2, label: "Easy" },
      { value: 3, label: "Moderate" },
      { value: 4, label: "Difficult" },
      { value: 5, label: "Very difficult" },
    ],
  },

  {
    id: "POST05",
    type: "single",
    construct: "CONFIDENCE",
    question:
      "How confident are you in the quality of the argument you prepared?",
    required: true,
    options: [
      { value: 1, label: "Not confident" },
      { value: 2, label: "Slightly confident" },
      { value: 3, label: "Moderately confident" },
      { value: 4, label: "Very confident" },
      { value: 5, label: "Extremely confident" },
    ],
  },

  {
    id: "POST06",
    type: "single",
    construct: "CONFIDENCE",
    question:
      "How confident are you in the quality of your answer to the unexpected question?",
    required: true,
    options: [
      { value: 1, label: "Not confident" },
      { value: 2, label: "Slightly confident" },
      { value: 3, label: "Moderately confident" },
      { value: 4, label: "Very confident" },
      { value: 5, label: "Extremely confident" },
    ],
  },

  {
    id: "POST07",
    type: "likert",
    construct: "PERCEIVED_UNDERSTANDING",
    question:
      "After completing the preparation task, I felt that I understood the topic well enough to explain it without assistance.",
    required: true,
  },

  {
    id: "POST08",
    type: "likert",
    construct: "INDEPENDENT_TRANSFER",
    question:
      "I was able to use what I learned during preparation when answering the unexpected question independently.",
    required: true,
  },

  {
    id: "POST09",
    type: "likert",
    construct: "INDEPENDENT_TRANSFER",
    question:
      "When the unexpected question appeared, I felt able to develop new reasoning rather than simply repeat my prepared points.",
    required: true,
  },

  {
    id: "POST10",
    type: "likert",
    construct: "METACOGNITIVE_CALIBRATION",
    question:
      "The unexpected question revealed weaknesses in my understanding that I had not noticed during preparation.",
    required: true,
  },
];

export const aiGroupQuestions = [
  {
    id: "MAN01",
    type: "single",
    construct: "MANIPULATION_CHECK",
    question:
      "Did you actually use a generative AI tool during the preparation period?",
    required: true,
    options: [
      {
        value: "YES",
        label: "Yes",
      },
      {
        value: "NO",
        label: "No",
      },
    ],
  },

  {
    id: "MAN02",
    type: "multi",
    construct: "AI_TOOL_USED",
    question: "Which AI tool or tools did you use during preparation?",
    required: true,
    showWhen: {
      questionId: "MAN01",
      value: "YES",
    },
    options: [
      {
        value: "CHATGPT",
        label: "ChatGPT",
      },
      {
        value: "GEMINI",
        label: "Google Gemini",
      },
      {
        value: "CLAUDE",
        label: "Claude",
      },
      {
        value: "DEEPSEEK",
        label: "DeepSeek",
      },
      {
        value: "COPILOT",
        label: "Microsoft Copilot",
      },
      {
        value: "PERPLEXITY",
        label: "Perplexity",
      },
      {
        value: "OTHER",
        label: "Other",
      },
    ],
  },

  {
    id: "MAN03",
    type: "single",
    construct: "AI_INTENSITY",
    question: "How much did you rely on AI during the preparation period?",
    required: true,
    showWhen: {
      questionId: "MAN01",
      value: "YES",
    },
    options: [
      {
        value: 1,
        label: "Very little",
      },
      {
        value: 2,
        label: "A little",
      },
      {
        value: 3,
        label: "Moderately",
      },
      {
        value: 4,
        label: "A lot",
      },
      {
        value: 5,
        label: "Very heavily",
      },
    ],
  },

  {
    id: "MAN04",
    type: "multi",
    construct: "AI_FUNCTION",
    question: "What did you use AI for during preparation?",
    required: true,
    showWhen: {
      questionId: "MAN01",
      value: "YES",
    },
    options: [
      {
        value: "BRAINSTORMING",
        label: "Generating ideas",
      },
      {
        value: "STRUCTURE",
        label: "Structuring the argument",
      },
      {
        value: "ARGUMENTS",
        label: "Generating arguments",
      },
      {
        value: "COUNTERARGUMENTS",
        label: "Generating counterarguments",
      },
      {
        value: "EXPLANATION",
        label: "Understanding the topic",
      },
      {
        value: "EXAMPLES",
        label: "Generating examples",
      },
      {
        value: "WRITING",
        label: "Writing or phrasing",
      },
      {
        value: "FULL_RESPONSE",
        label: "Producing most of the response",
      },
    ],
  },

  {
    id: "MAN05",
    type: "likert",
    construct: "AI_CONTRIBUTION",
    question: "AI substantially influenced the argument I eventually prepared.",
    required: true,
    showWhen: {
      questionId: "MAN01",
      value: "YES",
    },
  },
];

export const controlGroupQuestions = [
  {
    id: "MAN06",
    type: "single",
    construct: "CONTROL_COMPLIANCE",
    question:
      "During the preparation task, did you use any prohibited external assistance such as generative AI, search engines, websites, notes, textbooks, or help from another person?",
    required: true,
    options: [
      {
        value: "NO",
        label: "No",
      },
      {
        value: "YES",
        label: "Yes",
      },
    ],
  },

  {
    id: "MAN07",
    type: "multi",
    construct: "CONTROL_COMPLIANCE",
    question: "Which type of external assistance did you use?",
    required: true,
    showWhen: {
      questionId: "MAN06",
      value: "YES",
    },
    options: [
      {
        value: "GENERATIVE_AI",
        label: "Generative AI",
      },
      {
        value: "SEARCH_ENGINE",
        label: "Search engine",
      },
      {
        value: "WEBSITE",
        label: "Website",
      },
      {
        value: "TEXTBOOK_NOTES",
        label: "Textbook or notes",
      },
      {
        value: "OTHER_PERSON",
        label: "Another person",
      },
      {
        value: "OTHER",
        label: "Other",
      },
    ],
  },
];
