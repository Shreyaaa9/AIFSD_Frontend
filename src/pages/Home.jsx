// src/pages/Home.jsx - Landing Page
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const features = [
  { icon: "📝", title: "Easy Registration", desc: "Submit complaints in seconds with our intuitive form" },
  { icon: "🔍", title: "Real-time Tracking", desc: "Track your complaint status at any time" },
  { icon: "🤖", title: "AI Analysis", desc: "AI detects priority and recommends the right department" },
  { icon: "🔒", title: "Secure & Private", desc: "JWT-secured authentication keeps your data safe" },
];

const stats = [
  { value: "500+", label: "Complaints Resolved" },
  { value: "98%", label: "AI Accuracy" },
  { value: "24h", label: "Avg. Response Time" },
  { value: "12+", label: "Departments" },
];

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">🤖 AI-Powered Platform</div>
        <h1 className="hero-title">
          Smart Complaint
          <span className="hero-gradient"> Management</span>
        </h1>
        <p className="hero-subtitle">
          Register complaints, get AI-powered priority detection, department recommendations,
          and automated responses — all in one place.
        </p>
        <div className="hero-actions">
          <Link to="/submit" className="btn btn-primary btn-lg" id="hero-submit-btn">
            📝 Submit a Complaint
          </Link>
          <Link to="/complaints" className="btn btn-secondary btn-lg" id="hero-view-btn">
            📋 View All Complaints
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        {stats.map((s, i) => (
          <div className="stat-card card" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">Why Choose SmartComplaints?</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section card">
        <h2>Ready to get started?</h2>
        <p>Join thousands of citizens using AI to resolve complaints faster.</p>
        <div className="cta-actions">
          <Link to="/register" className="btn btn-primary btn-lg" id="cta-register-btn">
            Create Account
          </Link>
          <Link to="/ai-analysis" className="btn btn-secondary btn-lg" id="cta-ai-btn">
            Try AI Analysis
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
