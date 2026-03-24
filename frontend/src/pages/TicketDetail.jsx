import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const TicketDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const fetchTicket = async () => {
    try {
      const { data } = await api.get(`/tickets/${id}`);
      setTicket(data);
    } catch (err) {
      alert("Ticket not found");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const sendReply = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await api.post("/comments", { ticket_id: id, message });
      setMessage("");
      fetchTicket(); // Refresh to show new comment
    } catch (err) {
      alert("Error sending reply");
    } finally {
      setSending(false);
    }
  };

  if (!ticket) return <div className="loading">Loading ticket...</div>;

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
      <div className="detail-container">
        <button className="btn btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="ticket-detail-card">
          <div className="ticket-detail-header">
            <h1>{ticket.title}</h1>
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

          <div className="ticket-info-grid">
            <div>
              <strong>Customer:</strong> {ticket.customer_name}
            </div>
            <div>
              <strong>Agent:</strong> {ticket.assigned_to_name || "Unassigned"}
            </div>
            <div>
              <strong>Created:</strong>{" "}
              {new Date(ticket.created_at).toLocaleString()}
            </div>
            <div>
              <strong>Updated:</strong>{" "}
              {new Date(ticket.updated_at).toLocaleString()}
            </div>
          </div>

          <div className="ticket-description">
            <h3>📋 Description</h3>
            <p>{ticket.description}</p>
          </div>
        </div>

        {/* Comments / Conversation */}
        <div className="comments-section">
          <h2>💬 Conversation</h2>

          {ticket.comments?.length === 0 && (
            <div className="empty-state">
              <p>No replies yet. Be the first to respond!</p>
            </div>
          )}

          {ticket.comments?.map((comment) => (
            <div
              key={comment.id}
              className={`comment-bubble ${comment.user_id === user?.id ? "comment-mine" : "comment-other"}`}
            >
              <div className="comment-header">
                <span className="comment-author">{comment.author_name}</span>
                <span className={`role-badge role-${comment.author_role}`}>
                  {comment.author_role}
                </span>
                <span className="comment-time">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p>{comment.message}</p>
            </div>
          ))}

          {/* Reply form — only if ticket isn't closed */}
          {ticket.status !== "closed" && (
            <form onSubmit={sendReply} className="reply-form">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your reply here..."
                rows={3}
                required
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={sending}
              >
                {sending ? "Sending..." : "📤 Send Reply"}
              </button>
            </form>
          )}

          {ticket.status === "closed" && (
            <div className="alert alert-info">
              🔒 This ticket is closed. No more replies allowed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
