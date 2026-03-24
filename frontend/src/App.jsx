import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import TesterDashboard from "./pages/TesterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TicketDetail from "./pages/TicketDetail";
import "./App.css";

// Redirects logged-in users to their dashboard based on role
const RoleRoute = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === "admin") return <Navigate to="/admin" />;
  if (user.role === "tester") return <Navigate to="/tester" />;
  return <Navigate to="/customer" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RoleRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/tester" element={<TesterDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
