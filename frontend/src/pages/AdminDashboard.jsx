import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [tickets, setTickets] = useState([]);
  const [testers, setTesters] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("tickets");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/admin/analytics").then((r) => setAnalytics(r.data));
    api.get("/tickets/all").then((r) => setTickets(r.data));
    api.get("/admin/testers").then((r) => setTesters(r.data));
    api.get("/admin/users").then((r) => setUsers(r.data));
  }, []);

  const assignTicket = async (ticketId, testerId) => {
    if (!testerId) return;
    try {
      await api.patch(`/tickets/${ticketId}/assign`, { testerId });
      const { data } = await api.get("/tickets/all");
      setTickets(data);
      alert("Ticket assigned!");
    } catch (err) {
      alert("Error assigning ticket");
    }
  };

  const deleteTicket = async (ticketId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this ticket permanently?")) return;
    try {
      await api.delete(`/tickets/${ticketId}`);
      setTickets(tickets.filter((t) => t.id !== ticketId));
    } catch (err) {
      alert("Error deleting ticket");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h1>⚙️ Admin Dashboard</h1>

        {/* Analytics Cards */}
        <div className="stats-row">
          <div className="stat-card stat-blue">
            <div className="stat-num">{analytics.total || 0}</div>
            <div>Total Tickets</div>
          </div>
          <div className="stat-card stat-yellow">
            <div className="stat-num">{analytics.open || 0}</div>
            <div>Open</div>
          </div>
          <div className="stat-card stat-orange">
            <div className="stat-num">{analytics.in_progress || 0}</div>
            <div>In Progress</div>
          </div>
          <div className="stat-card stat-green">
            <div className="stat-num">{analytics.resolved || 0}</div>
            <div>Resolved</div>
          </div>
          <div className="stat-card stat-gray">
            <div className="stat-num">{analytics.total_users || 0}</div>
            <div>Total Users</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "tickets" ? "active" : ""}`}
            onClick={() => setActiveTab("tickets")}
          >
            🎫 All Tickets
          </button>
          <button
            className={`tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 All Users
          </button>
        </div>

        {activeTab === "tickets" && (
          <div className="tickets-list">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="ticket-card"
                onClick={() => navigate(`/ticket/${ticket.id}`)}
              >
                <div className="ticket-top">
                  <h3>{ticket.title}</h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span className={`badge badge-${ticket.status}`}>
                      {ticket.status}
                    </span>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => deleteTicket(ticket.id, e)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="ticket-desc">
                  {ticket.description.substring(0, 80)}...
                </p>
                <div className="ticket-meta">
                  <span>👤 {ticket.customer_name}</span>
                  <span>🔴 {ticket.priority}</span>
                </div>
                <div
                  className="assign-row"
                  onClick={(e) => e.stopPropagation()}
                >
                  <label>Assign to:</label>
                  <select
                    value={ticket.assigned_to || ""}
                    onChange={(e) => assignTicket(ticket.id, e.target.value)}
                    className="filter-select"
                  >
                    <option value="">-- Select Agent --</option>
                    {testers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge role-${u.role}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
