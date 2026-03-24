import { useNavigate } from "react-router-dom";

const statusColor = {
  open: "#3b82f6",
  in_progress: "#f59e0b",
  resolved: "#10b981",
  closed: "#6b7280",
};

const priorityColor = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
};

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();

  return (
    <div
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
      <p className="ticket-desc">{ticket.description.substring(0, 100)}...</p>
      <div className="ticket-meta">
        <span>📅 {new Date(ticket.created_at).toLocaleDateString()}</span>
        {ticket.assigned_to_name && (
          <span>👤 Agent: {ticket.assigned_to_name}</span>
        )}
        {ticket.customer_name && (
          <span>👤 Customer: {ticket.customer_name}</span>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
