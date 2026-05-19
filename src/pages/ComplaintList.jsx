// src/pages/ComplaintList.jsx - Complaint List Page (Q1 - Module 2)
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { complaintAPI } from "../services/api";
import "./ComplaintList.css";

const CATEGORIES = ["All", "Water Supply", "Electricity", "Sanitation", "Roads", "Public Safety", "Noise", "Other"];
const STATUSES   = ["All", "Pending", "In Progress", "Resolved", "Closed"];

const statusBadge = (status) => {
  const map = {
    "Pending": "badge-pending",
    "In Progress": "badge-progress",
    "Resolved": "badge-resolved",
    "Closed": "badge-closed",
  };
  return map[status] || "badge-pending";
};

const ComplaintList = () => {
  const [complaints, setComplaints]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [searchLocation, setSearch]   = useState("");
  const [filterCategory, setCategory] = useState("All");
  const [filterStatus, setStatus]     = useState("All");
  const [deletingId, setDeletingId]   = useState(null);

  // ─── Fetch Complaints ──────────────────────────────
  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (searchLocation.trim()) {
        res = await complaintAPI.searchByLocation(searchLocation.trim());
      } else {
        const params = {};
        if (filterCategory !== "All") params.category = filterCategory;
        if (filterStatus   !== "All") params.status   = filterStatus;
        res = await complaintAPI.getAllComplaints(params);
      }
      setComplaints(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  }, [searchLocation, filterCategory, filterStatus]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // ─── Delete Complaint ──────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    setDeletingId(id);
    try {
      await complaintAPI.deleteComplaint(id);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>📋 All Complaints</h1>
        <p>Browse, filter, and manage all submitted complaints.</p>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar card" id="complaints-filter-section">
        {/* Location Search */}
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            id="location-search"
            type="text"
            className="form-input search-input"
            placeholder="🔍 Search by location..."
            value={searchLocation}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm" id="search-btn">Search</button>
          {searchLocation && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setSearch(""); }}
            >Clear</button>
          )}
        </form>

        <div className="filter-selects">
          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              id="filter-category"
              className="form-select filter-select"
              value={filterCategory}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select
              id="filter-status"
              className="form-select filter-select"
              value={filterStatus}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Count */}
      <div className="results-count">
        {!loading && (
          <span>{complaints.length} complaint{complaints.length !== 1 ? "s" : ""} found</span>
        )}
      </div>

      {/* Loading */}
      {loading && <div className="spinner" role="status" aria-label="Loading..."></div>}

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Complaints Grid */}
      {!loading && !error && (
        <>
          {complaints.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
              <h3>No complaints found</h3>
              <p>Try adjusting your filters or search term.</p>
              <Link to="/submit" className="btn btn-primary" style={{ marginTop: "1rem" }}>
                Submit First Complaint
              </Link>
            </div>
          ) : (
            <div className="complaints-grid">
              {complaints.map((complaint, idx) => (
                <div
                  key={complaint._id}
                  className="complaint-card card animate-fadeInUp"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Header */}
                  <div className="complaint-card-header">
                    <span className={`badge ${statusBadge(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    <span className="complaint-category">📁 {complaint.category}</span>
                  </div>

                  {/* Title */}
                  <h3 className="complaint-title">{complaint.title}</h3>

                  {/* Meta */}
                  <div className="complaint-meta">
                    <span>👤 {complaint.name}</span>
                    <span>📍 {complaint.location}</span>
                  </div>

                  {/* Description preview */}
                  <p className="complaint-desc">
                    {complaint.description.length > 100
                      ? complaint.description.substring(0, 100) + "..."
                      : complaint.description}
                  </p>

                  {/* AI Analysis Badge */}
                  {complaint.aiAnalysis?.priority && (
                    <div className="ai-badge">
                      🤖 AI:{" "}
                      <span className={`badge badge-${complaint.aiAnalysis.priority.toLowerCase()}`}>
                        {complaint.aiAnalysis.priority} Priority
                      </span>
                      {complaint.aiAnalysis.department && (
                        <span className="ai-dept"> · {complaint.aiAnalysis.department}</span>
                      )}
                    </div>
                  )}

                  {/* Date */}
                  <div className="complaint-date">
                    🕐 {new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </div>

                  {/* Actions */}
                  <div className="complaint-actions">
                    <Link
                      to={`/complaints/${complaint._id}/status`}
                      className="btn btn-secondary btn-sm"
                      id={`update-status-${complaint._id}`}
                    >
                      ✏️ Update Status
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      id={`delete-complaint-${complaint._id}`}
                      onClick={() => handleDelete(complaint._id)}
                      disabled={deletingId === complaint._id}
                    >
                      {deletingId === complaint._id ? "..." : "🗑️ Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ComplaintList;
