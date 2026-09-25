import { Route, Routes } from "react-router-dom";

import CreateInvitationPage from "./pages/CreateInvitationPage";
import InvitationPage from "./pages/InvitationPage";
import CreatorResultPage from "./pages/CreatorResultPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreateInvitationPage />} />

      <Route path="/invite/:token" element={<InvitationPage />} />
      <Route path="/manage/:token" element={<CreatorResultPage />} />
    </Routes>
  );
}

export default App;
