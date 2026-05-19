// src/pages/AIAnalysis.jsx - AI Analysis Result Display (Q1 - Module 4 & Q5 - AI Integration)
import React, { useState } from "react";
import { aiAPI } from "../services/api";
import "./AIAnalysis.css";

const CATEGORIES = [
  "Water Supply", "Electricity", "Sanitation", "Roads", "Public Safety", "Noise", "Other",
];

const testCases = [
  { title: "Water pipe damaged near market", description: "Water pipeline damaged near market area causing major leakage and flooding on roads.", category: "Water Supply" },
  { title: "Power outage since 6 hours", description: "Electricity has been cut off for the entire block since morning. No lights, no fans, extreme heat.", category: "Electricity" },
  { title: "Garbage not collected for 2 weeks", description: "Garbage has not been collected for 2 weeks. The smell is unbearable and health hazard is increasing.", category: "Sanitation" },
  { title: "Large pothole causing accidents", description: "A large pothole on Main Street has already caused 3 bike accidents this week. Immediate repair needed.", category: "Roads" },
];

const AIAnalysis = () => {
  const [form, setForm] = useState({ title: "", description: "", category: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loadTestCase = (tc) => {
    setForm({ title: tc.title, description: tc.description, category: tc.category });
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      setError("Please provide title and description");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data } = await aiAPI.analyzeComplaint(form);
      setResult(data.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || "AI analysis failed. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (p) =>
    p === "High" ? "#ef4444" : p === "Medium" ? "#f59e0b" : "#10b981";

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>🤖 AI Complaint Analyzer</h1>
        <p>Enter complaint details below — AI will detect priority, recommend department, and generate a response.</p>
      </div>

      {/* Test Case Quick Load */}
      <div className="test-cases-section card">
        <h3>⚡ Quick Test Cases</h3>
        <div className="test-cases-grid">
          {testCases.map((tc, i) => (
            <button
              key={i}
              id={`test-case-${i}`}
              className="test-case-btn"
              onClick={() => loadTestCase(tc)}
            >
              <span className="tc-category">{tc.category}</span>
              <span className="tc-title">{tc.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ai-analysis-layout">
        {/* Input Form */}
        <div className="card animate-fadeInUp">
          <h2 className="info-title">📝 Complaint Input</h2>

          <form onSubmit={handleAnalyze} id="ai-analyze-form">
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="ai-title">Complaint Title *</label>
              <input
                id="ai-title"
                name="title"
                type="text"
                className="form-input"
                placeholder="e.g. Water Leakage Issue"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ai-category">Category</label>
              <select
                id="ai-category"
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select category (optional)</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ai-description">Complaint Description *</label>
              <textarea
                id="ai-description"
                name="description"
                className="form-textarea"
                placeholder="Describe the complaint in detail..."
                value={form.description}
                onChange={handleChange}
                rows={5}
              />
            </div>

            <button
              id="run-ai-btn"
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={loading}
            >
              {loading ? (
                <><span className="btn-spinner"></span> Analyzing with AI...</>
              ) : (
                "🚀 Run AI Analysis"
              )}
            </button>
          </form>
        </div>

        {/* AI Result Display */}
        <div className="ai-output-section">
          {loading && (
            <div className="card ai-loading-card">
              <div className="ai-loading-animation">
                <div className="ai-pulse">🤖</div>
                <h3>AI is analyzing your complaint...</h3>
                <p>Detecting priority, department, generating response...</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="card ai-full-result animate-fadeInUp">
              <div className="result-header">
                <span className="result-ai-icon">🤖</span>
                <div>
                  <h2>AI Analysis Complete</h2>
                  <p>Here are the AI-generated insights:</p>
                </div>
              </div>

              {/* Priority */}
              <div className="result-block priority-block" style={{ borderColor: getPriorityColor(result.priority) }}>
                <div className="result-block-header">
                  <span className="rblock-icon">🎯</span>
                  <span className="rblock-label">PRIORITY LEVEL</span>
                </div>
                <div className="priority-display" style={{ color: getPriorityColor(result.priority) }}>
                  {result.priority === "High" ? "🔴" : result.priority === "Medium" ? "🟡" : "🟢"}
                  {" "}{result.priority} Priority
                </div>
                <p className="rblock-desc">{result.priorityReason}</p>
              </div>

              {/* Department */}
              <div className="result-block dept-block">
                <div className="result-block-header">
                  <span className="rblock-icon">🏛️</span>
                  <span className="rblock-label">RECOMMENDED DEPARTMENT</span>
                </div>
                <div className="dept-display">{result.department}</div>
                <p className="rblock-desc">{result.departmentReason}</p>
              </div>

              {/* Summary */}
              <div className="result-block summary-block">
                <div className="result-block-header">
                  <span className="rblock-icon">📋</span>
                  <span className="rblock-label">AI SUMMARY</span>
                </div>
                <p className="summary-text">{result.summary}</p>
              </div>

              {/* Auto Response */}
              <div className="result-block response-block">
                <div className="result-block-header">
                  <span className="rblock-icon">💬</span>
                  <span className="rblock-label">AUTO-GENERATED RESPONSE</span>
                </div>
                <p className="response-text">"{result.autoResponse}"</p>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="card ai-placeholder">
              <div className="placeholder-content">
                <div className="placeholder-icon">🤖</div>
                <h3>Ready to Analyze</h3>
                <p>Enter complaint details or pick a test case to see AI in action.</p>
                <div className="feature-chips">
                  <span className="chip">🎯 Priority Detection</span>
                  <span className="chip">🏛️ Dept. Recommendation</span>
                  <span className="chip">📋 Smart Summary</span>
                  <span className="chip">💬 Auto Response</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
