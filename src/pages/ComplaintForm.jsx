// src/pages/ComplaintForm.jsx - Complaint Registration Form (Q1 - Module 1)
import React, { useState } from "react";
import { complaintAPI, aiAPI } from "../services/api";
import "./ComplaintForm.css";

const CATEGORIES = [
  "Water Supply",
  "Electricity",
  "Sanitation",
  "Roads",
  "Public Safety",
  "Noise",
  "Other",
];

const initialForm = {
  name: "",
  email: "",
  title: "",
  description: "",
  category: "",
  location: "",
};

const ComplaintForm = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [submittedId, setSubmittedId] = useState(null);

  // ─── Validation ─────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.name.trim())        errs.name        = "Name is required";
    if (!form.email.trim())       errs.email       = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email format";
    if (!form.title.trim())       errs.title       = "Complaint title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.category)           errs.category    = "Please select a category";
    if (!form.location.trim())    errs.location    = "Location is required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ─── Submit Complaint ────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setSuccess(null);
    setAiResult(null);

    try {
      // 1. Save complaint to DB
      const { data } = await complaintAPI.addComplaint(form);
      const complaint = data.data;
      setSubmittedId(complaint._id);

      // 2. Automatically run AI analysis
      const aiRes = await aiAPI.analyzeComplaint({
        title: form.title,
        description: form.description,
        category: form.category,
        complaintId: complaint._id,
      });

      setAiResult(aiRes.data.data.analysis);
      setSuccess("Complaint submitted and analyzed successfully!");
      setForm(initialForm);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Failed to submit complaint" });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityClass = (priority) => {
    if (!priority) return "";
    return priority.toLowerCase();
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>📝 Submit a Complaint</h1>
        <p>Fill in the details below. Our AI will automatically analyze your complaint.</p>
      </div>

      <div className="complaint-form-layout">
        {/* Form Section */}
        <div className="card animate-fadeInUp">
          <form onSubmit={handleSubmit} id="complaint-registration-form">
            {errors.submit && (
              <div className="alert alert-error" role="alert">{errors.submit}</div>
            )}
            {success && (
              <div className="alert alert-success" role="status">✅ {success}</div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rahul Kumar"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="e.g. rahul@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="title">Complaint Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                placeholder="e.g. Water Leakage Issue"
                value={form.title}
                onChange={handleChange}
              />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Complaint Description *</label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                placeholder="Describe your complaint in detail..."
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
              {errors.description && <p className="form-error">{errors.description}</p>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="category">Complaint Category *</label>
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="form-error">{errors.category}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="location">Location *</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ghaziabad"
                  value={form.location}
                  onChange={handleChange}
                />
                {errors.location && <p className="form-error">{errors.location}</p>}
              </div>
            </div>

            <button
              id="submit-complaint-btn"
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Submitting & Analyzing...
                </>
              ) : (
                "🚀 Submit & Analyze with AI"
              )}
            </button>
          </form>
        </div>

        {/* AI Result Panel */}
        {aiResult && (
          <div className="ai-result-panel card animate-fadeInUp">
            <div className="ai-result-header">
              <span className="ai-icon">🤖</span>
              <h2>AI Analysis Result</h2>
            </div>

            <div className="ai-result-item">
              <span className="ai-result-label">Priority Level</span>
              <span className={`badge badge-${getPriorityClass(aiResult.priority)}`}>
                {aiResult.priority === "High" ? "🔴" : aiResult.priority === "Medium" ? "🟡" : "🟢"}
                {" "}{aiResult.priority}
              </span>
            </div>

            <div className="ai-result-item">
              <span className="ai-result-label">Priority Reason</span>
              <p className="ai-result-text">{aiResult.priorityReason}</p>
            </div>

            <div className="ai-result-item">
              <span className="ai-result-label">Recommended Department</span>
              <span className="department-badge">🏛️ {aiResult.department}</span>
            </div>

            <div className="ai-result-item">
              <span className="ai-result-label">AI Summary</span>
              <p className="ai-result-text">{aiResult.summary}</p>
            </div>

            <div className="ai-result-item auto-response">
              <span className="ai-result-label">Auto-Generated Response</span>
              <p className="ai-result-response">{aiResult.autoResponse}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintForm;
