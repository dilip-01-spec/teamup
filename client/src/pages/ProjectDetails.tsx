import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Plus,
  CheckCircle,
  X,
  Clock,
  Briefcase,
} from "lucide-react";
import { getProject, type Project } from "../services/api";
import "../App.css";

/* ── Unified Minimal Navbar ── */
function Navbar() {
  return (
    <div className="shared-navbar-wrap">
      <div className="shared-navbar-inner">
        <Link to="/" className="brand">
          team<span className="brand-highlight">up</span>
          <span className="brand-dot" />
        </Link>

        <nav className="shared-nav-links">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/create">Post a project</Link>
        </nav>

        <div className="shared-nav-actions">
          <Link to="/create" className="nav-post-btn">
            <Plus size={14} /> Post project
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Join Modal ── */
interface JoinModalProps {
  project: Project;
  onClose: () => void;
}

function JoinModal({ project, onClose }: JoinModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email address.");
      return;
    }
    setError("");
    setSubmitting(true);

    console.log("Join request submitted:", {
      projectId: project._id,
      projectTitle: project.title,
      name,
      email,
      message,
    });

    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {submitted ? (
          <div className="modal-success">
            <CheckCircle size={44} />
            <h3>Request dispatched!</h3>
            <p>
              Your collaboration request for <strong>{project.title}</strong> has been
              recorded. The creator ({project.creatorName}) can now reach out to you.
            </p>
            <button className="btn-primary" onClick={onClose} style={{ marginTop: 12 }}>
              Back to project
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <h3>Request to join project</h3>
                <p>Send your collaboration proposal to {project.creatorName}.</p>
              </div>
              <button
                onClick={onClose}
                style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-field">
                <label>Your full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                />
              </div>

              <div className="modal-field">
                <label>Contact email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                />
              </div>

              <div className="modal-field">
                <label>How can you contribute? (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mention your relevant experience, GitHub profile, or why you're interested in this project..."
                />
              </div>

              {error && <p className="form-error">{error}</p>}

              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="modal-submit" disabled={submitting}>
                  {submitting ? "Sending..." : "Submit request"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Project Details Page ── */
export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Invalid project ID.");
      setLoading(false);
      return;
    }
    getProject(id)
      .then(setProject)
      .catch(() => setError("Project not found or server is unreachable."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="explore-container" style={{ paddingTop: 64 }}>
          <p className="explore-message">Loading project specification...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="explore-container" style={{ paddingTop: 64 }}>
          <h2 style={{ marginBottom: 16 }}>{error || "Project not found"}</h2>
          <Link to="/explore" className="back-link">
            <ArrowLeft size={16} /> Return to Explore
          </Link>
        </div>
      </div>
    );
  }

  const isOpen = project.status === "Open";

  return (
    <>
      <div className="page-shell">
        <Navbar />

        <div className="explore-container" style={{ paddingTop: 36 }}>
          <Link to="/explore" className="back-link">
            <ArrowLeft size={15} /> Back to all projects
          </Link>

          {/* Main Details Card */}
          <section className="details-card">
            <span className="eyebrow">{project.category}</span>

            <h1>{project.title}</h1>

            <p>{project.description}</p>

            <h3>Skills Required</h3>
            <div className="project-skills">
              {project.skillsRequired.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <h3>Roles We're Looking For</h3>
            <div className="project-skills">
              {project.lookingFor.map((role) => (
                <span key={role} style={{ borderColor: "var(--accent-border)", color: "var(--text-primary)" }}>
                  {role}
                </span>
              ))}
            </div>

            <div className="details-meta">
              <span>
                <Users size={15} style={{ color: "var(--accent)" }} />
                Created by {project.creatorName}
              </span>
              <span>
                <Clock size={15} />
                {project.commitment} commitment
              </span>
              <span className={`status-badge ${isOpen ? "status-open" : ""}`}>
                <span className="status-dot" style={{ backgroundColor: isOpen ? "var(--accent)" : "var(--text-secondary)" }} />
                {project.status}
              </span>
            </div>
          </section>

          {/* Join Collaboration Box */}
          <div className="join-section">
            <div>
              <h3>Interested in collaborating?</h3>
              <p>
                Connect directly with {project.creatorName} to request a spot on this team.
              </p>
            </div>
            {isOpen ? (
              <button className="join-btn" onClick={() => setShowJoin(true)}>
                <Briefcase size={15} /> Request to join
              </button>
            ) : (
              <button className="join-btn" disabled>
                {project.status === "Completed" ? "Project completed" : "Applications closed"}
              </button>
            )}
          </div>
        </div>
      </div>

      {showJoin && (
        <JoinModal project={project} onClose={() => setShowJoin(false)} />
      )}
    </>
  );
}
