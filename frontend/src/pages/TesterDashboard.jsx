import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const TesterDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const url = filter
        ? `/tickets/assigned?status=${filter}`
        : "/tickets/assigned";
      const { data } = await api.get(url);
      setTickets(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const updateStatus = async (ticketId, status, e) => {
    e.stopPropagation(); // Don't navigate on dropdown change
    try {
      await api.patch(`/tickets/${ticketId}/status`, { status });
      fetchTickets();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const statusColor = {
    open: "#3b82f6",
    in_progress: "#f59e0b",
    resolved: "#10b981",
    closed: "#6b7280",
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>🛠️ My Assigned Tickets</h1>
            <p>Manage and resolve customer issues</p>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num">{tickets.length}</div>
            <div>Assigned</div>
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
              <p>No tickets assigned to you yet.</p>
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
                  <select
                    value={ticket.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(ticket.id, e.target.value, e)}
                    className="status-select"
                    style={{ borderColor: statusColor[ticket.status] }}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <p className="ticket-desc">
                  {ticket.description.substring(0, 100)}...
                </p>
                <div className="ticket-meta">
                  <span>👤 Customer: {ticket.customer_name}</span>
                  <span>🔴 Priority: {ticket.priority}</span>
                  <span>
                    📅 {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TesterDashboard;
