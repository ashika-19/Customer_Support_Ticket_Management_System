import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });
  const [message, setMessage] = useState("");

  const fetchTickets = async () => {
    try {
      const { data } = await api.get("/tickets/my");
      setTickets(data);
    } catch (err) {
      console.error("Error fetching tickets");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tickets", form);
      setMessage("✅ Ticket created successfully!");
      setForm({ title: "", description: "", priority: "medium" });
      setShowForm(false);
      fetchTickets();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Error creating ticket.");
    }
  };

  const statusColor = {
    open: "#3b82f6",
    in_progress: "#f59e0b",
    resolved: "#10b981",
    closed: "#6b7280",
  };
  const priorityColor = { low: "#10b981", medium: "#f59e0b", high: "#ef4444" };

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>My Support Tickets</h1>
            <p>Welcome back, {user?.name}! 👋</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ New Ticket"}
          </button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}

        {showForm && (
          <div className="card form-card">
            <h3>Create New Ticket</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Brief summary of your issue"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe your issue in detail..."
                  rows={4}
                  required
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Submit Ticket
              </button>
            </form>
          </div>
        )}

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num">{tickets.length}</div>
            <div>Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">
              {tickets.filter((t) => t.status === "open").length}
            </div>
            <div>Open</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">
              {tickets.filter((t) => t.status === "in_progress").length}
            </div>
            <div>In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">
              {tickets.filter((t) => t.status === "resolved").length}
            </div>
            <div>Resolved</div>
          </div>
        </div>

        <div className="tickets-list">
          {tickets.length === 0 ? (
            <div className="empty-state">
              <p>🎉 No tickets yet! Click "+ New Ticket" to get help.</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="ticket-card"
                onClick={() => navigate(`/ticket/${ticket.id}`)}
              >
                <div className="ticket-top">
                  <h3>{ticket.title}</h3>
                  <div className="ticket-badges">
                    <span
                      className="badge"
                      style={{ background: priorityColor[ticket.priority] }}
                    >
                      {ticket.priority}
                    </span>
                    <span
                      className="badge"
                      style={{ background: statusColor[ticket.status] }}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <p className="ticket-desc">
                  {ticket.description.substring(0, 100)}...
                </p>
                <div className="ticket-meta">
                  <span>
                    📅 {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                  {ticket.assigned_to_name && (
                    <span>👤 Agent: {ticket.assigned_to_name}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
