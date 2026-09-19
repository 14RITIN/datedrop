import { Route, Routes } from 'react-router-dom';

import CreateInvitationPage from './pages/CreateInvitationPage';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<CreateInvitationPage />}
      />
    </Routes>
  );
}

export default App;