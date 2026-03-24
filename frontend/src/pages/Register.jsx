import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", form);
      setSuccess("Registered! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>📝 Create Account</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              required
            />
          </div>
          <div className="form-group">
            <label>Register As</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="tester">Support Agent (Tester)</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Create Account
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
