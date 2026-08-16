export const verificationItems = [
  {
    id: "VER01",

    domain: "SCIENCE",

    prompt:
      "A student asks an AI: Why do astronauts appear weightless inside the International Space Station?",

    aiAnswer:
      "Astronauts appear weightless because there is essentially no gravity acting on them in orbit. The International Space Station is far enough from Earth that Earth's gravitational pull becomes negligible.",

    correctStatus: "INCORRECT",

    explanation:
      "Gravity is still strong at the altitude of the ISS. Astronauts appear weightless because the station and everything inside it are continuously falling around Earth together.",

    difficulty: "MEDIUM",
  },

  {
    id: "VER02",

    domain: "STATISTICS",

    prompt:
      "An AI is asked: If two variables have a correlation of 0, does that prove there is no relationship between them?",

    aiAnswer:
      "Yes. A correlation coefficient of 0 means that the two variables have no relationship with one another.",

    correctStatus: "INCORRECT",

    explanation:
      "Zero correlation indicates no linear relationship, but a strong nonlinear relationship may still exist.",

    difficulty: "MEDIUM",
  },

  {
    id: "VER03",

    domain: "GENERAL_REASONING",

    prompt:
      "An AI evaluates the statement: 'All medical students study biology. Rahim studies biology. Therefore, Rahim must be a medical student.'",

    aiAnswer:
      "The conclusion is logically valid because Rahim satisfies the condition that medical students study biology.",

    correctStatus: "INCORRECT",

    explanation:
      "This commits the fallacy of affirming the consequent. Many people who are not medical students may also study biology.",

    difficulty: "MEDIUM",
  },

  {
    id: "VER04",

    domain: "ECONOMICS",

    prompt:
      "An AI is asked what usually happens to demand for a normal good when consumer income increases, assuming other factors stay constant.",

    aiAnswer:
      "Demand for a normal good generally increases when consumer income increases.",

    correctStatus: "CORRECT",

    explanation:
      "For a normal good, higher consumer income generally shifts demand upward, other things being equal.",

    difficulty: "EASY",
  },

  {
    id: "VER05",

    domain: "RESEARCH",

    prompt:
      "An AI says: 'A statistically significant result proves that the research hypothesis is true.'",

    aiAnswer:
      "Correct. If p < 0.05, the study has proven that its research hypothesis is true.",

    correctStatus: "INCORRECT",

    explanation:
      "Statistical significance does not prove a hypothesis is true. It indicates that the observed data would be relatively unlikely under the specified null hypothesis, given the model assumptions.",

    difficulty: "MEDIUM",
  },
];
