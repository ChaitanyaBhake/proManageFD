import { Route, Routes } from 'react-router-dom';
import './App.css';
import AuthProvider from './context/AuthProvider';
import TaskProvider from './context/TaskProvider';
import AdminHero from './pages/Admin/AdminHero/AdminHero';
import Analytics from './pages/Admin/Analytics/Analytics';
import Board from './pages/Admin/Board/Board';
import Settings from './pages/Admin/Settings/Settings';
import AuthHero from './pages/Auth/AuthHero/AuthHero';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import PublicView from './pages/Public/PublicView';

function App() {
  return (
    <>
      <Routes>
        {/* Auth Route */}
        <Route
          path="/auth"
          element={
            <AuthProvider>
              <AuthHero />
            </AuthProvider>
          }
        >
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Home Route */}
        <Route
          path="/"
          element={
            <AuthProvider>
              <AdminHero />
            </AuthProvider>
          }
        >
          <Route
            index
            element={
              <TaskProvider>
                <Board />
              </TaskProvider>
            }
          />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Public View Route */}
        <Route path="/task/:taskId" element={<PublicView />} />
      </Routes>
    </>
  );
}

export default App;
