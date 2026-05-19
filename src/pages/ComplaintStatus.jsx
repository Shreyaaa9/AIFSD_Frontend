// src/pages/ComplaintStatus.jsx - Complaint Status Update Page (Q1 - Module 3)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { complaintAPI } from "../services/api";
import "./ComplaintStatus.css";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved", "Closed"];

const statusInfo = {
  "Pending":     { color: "#fbbf24", icon: "⏳", desc: "Complaint received, awaiting review" },
  "In Progress": { color: "#22d3ee", icon: "🔧", desc: "Complaint is being actively worked on" },
  "Resolved":    { color: "#34d399", icon: "✅", desc: "Complaint has been resolved" },
  "Closed":      { color: "#94a3b8", icon: "🔒", desc: "Complaint closed, no further action" },
};

const ComplaintStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // ─── Load Complaint ──────────────────────────────
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const { data } = await complaintAPI.getComplaintById(id);
        setComplaint(data.data);
        setSelectedStatus(data.data.status);
      } catch (err) {
        setError(err.response?.data?.message || "Complaint not found");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  // ─── Update Status ───────────────────────────────
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (selectedStatus === complaint.status) {
      setError("Please select a different status");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const { data } = await complaintAPI.updateStatus(id, selectedStatus);
      setComplaint(data.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-wrapper"><div className="spinner"></div></div>;

  if (error && !complaint) {
    return (
      <div className="page-wrapper">
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate("/complaints")}>
          ← Back to Complaints
        </button>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>✏️ Update Complaint Status</h1>
        <p>Change the status of complaint: <strong>{complaint?.title}</strong></p>
      </div>

      <div className="status-layout">
        {/* Complaint Info */}
        <div className="card complaint-info-card animate-fadeInUp">
          <h2 className="info-title">Complaint Details</h2>

          <div className="info-row">
            <span className="info-label">Title</span>
            <span className="info-value">{complaint.title}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Submitted By</span>
            <span className="info-value">{complaint.name} ({complaint.email})</span>
          </div>
          <div className="info-row">
            <span className="info-label">Category</span>
            <span className="info-value">{complaint.category}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Location</span>
            <span className="info-value">📍 {complaint.location}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Description</span>
            <p className="info-desc">{complaint.description}</p>
          </div>
          <div className="info-row">
            <span className="info-label">Submitted On</span>
            <span className="info-value">
              {new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </span>
          </div>

          {/* AI Analysis Summary */}
          {complaint.aiAnalysis?.priority && (
            <div className="ai-summary-box">
              <h3>🤖 AI Analysis</h3>
              <div className="ai-row">
                <span>Priority:</span>
                <span className={`badge badge-${complaint.aiAnalysis.priority.toLowerCase()}`}>
                  {complaint.aiAnalysis.priority}
                </span>
              </div>
              <div className="ai-row">
                <span>Department:</span>
                <span>{complaint.aiAnalysis.department}</span>
              </div>
            </div>
          )}
        </div>

        {/* Status Update Form */}
        <div className="card status-form-card animate-fadeInUp">
          <h2 className="info-title">Update Status</h2>

          {success && (
            <div className="alert alert-success">✅ Status updated successfully!</div>
          )}
          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          <form onSubmit={handleUpdateStatus} id="status-update-form">
            {/* Status Selector */}
            <div className="status-options">
              {STATUS_OPTIONS.map((status) => {
                const info = statusInfo[status];
                return (
                  <label
                    key={status}
                    className={`status-option ${selectedStatus === status ? "selected" : ""}`}
                    id={`status-option-${status.replace(" ", "-").toLowerCase()}`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={selectedStatus === status}
                      onChange={() => setSelectedStatus(status)}
                    />
                    <div className="status-option-content">
                      <span className="status-icon" style={{ color: info.color }}>
                        {info.icon}
                      </span>
                      <div>
                        <div className="status-name" style={{ color: info.color }}>{status}</div>
                        <div className="status-desc">{info.desc}</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="status-actions">
              <button
                type="submit"
                id="save-status-btn"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "💾 Save Status"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/complaints")}
              >
                ← Back to List
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintStatus;
