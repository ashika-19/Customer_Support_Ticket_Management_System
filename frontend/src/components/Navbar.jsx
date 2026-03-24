import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardLink =
    {
      admin: "/admin",
      tester: "/tester",
      customer: "/customer",
    }[user?.role] || "/login";

  return (
    <nav className="navbar">
      <Link to={dashboardLink} className="nav-brand">
        🎫 SupportDesk
      </Link>
      {user && (
        <div className="nav-right">
          <span className="nav-user">
            👤 {user.name}{" "}
            <span className={`role-badge role-${user.role}`}>{user.role}</span>
          </span>
          <button onClick={handleLogout} className="btn btn-logout">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
