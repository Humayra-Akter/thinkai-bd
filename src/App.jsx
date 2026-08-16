import { Navigate, Route, Routes } from "react-router";

import Home from "./pages/Home";
import ResearchInfo from "./pages/ResearchInfo";
import Consent from "./pages/Consent";
import ParticipantSetup from "./pages/ParticipantSetup";
import ParticipantReady from "./pages/ParticipantReady";
import Dashboard from "./pages/Dashboard";
import AIUsage from "./pages/AIUsage";
import CognitiveOffloading from "./pages/CognitiveOffloading";
import DependencyAssessment from "./pages/DependencyAssessment";
import ExperimentIntro from "./pages/ExperimentIntro";
import ExperimentPreparation from "./pages/ExperimentPreparation";
import ExperimentChallenge from "./pages/ExperimentChallenge";
import PostExperiment from "./pages/PostExperiment";
import CognitiveEngagement from "./pages/CognitiveEngagement";
import VerificationChallenge from "./pages/VerificationChallenge";
import Results from "./pages/Results";
import Debrief from "./pages/Debrief";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/research-info" element={<ResearchInfo />} />
      <Route path="/consent" element={<Consent />} />
      <Route path="/participant-setup" element={<ParticipantSetup />} />
      <Route path="/participant-ready" element={<ParticipantReady />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ai-usage" element={<AIUsage />} />
      <Route path="/cognitive-offloading" element={<CognitiveOffloading />} />
      <Route path="/dependency" element={<DependencyAssessment />} />
      <Route path="/experiment-intro" element={<ExperimentIntro />} />
      <Route
        path="/experiment/preparation"
        element={<ExperimentPreparation />}
      />
      <Route path="/experiment/challenge" element={<ExperimentChallenge />} />
      <Route path="/post-experiment" element={<PostExperiment />} />
      <Route path="/cognitive-engagement" element={<CognitiveEngagement />} />
      <Route
        path="/verification-challenge"
        element={<VerificationChallenge />}
      />
      <Route path="/results" element={<Results />} />
      <Route path="/debrief" element={<Debrief />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
