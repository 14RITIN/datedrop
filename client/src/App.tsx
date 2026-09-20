import { Route, Routes } from 'react-router-dom';

import CreateInvitationPage from './pages/CreateInvitationPage';
import InvitationPage from './pages/InvitationPage';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<CreateInvitationPage />}
      />

      <Route
        path="/invite/:token"
        element={<InvitationPage />}
      />
    </Routes>
  );
}

export default App;