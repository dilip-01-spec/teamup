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
  ShieldCheck,
  UserCheck,
  XCircle,
  Check,
} from "lucide-react";
import {
  getProject,
  createJoinRequest,
  getProjectRequests,
  updateRequestStatus,
  type Project,
  type JoinRequest,
} from "../services/api";
import "../App.css";

/* ── Unified Minimalist Navbar ── */
function Navbar() {
  return (
    <div className="shared-navbar-wrap">
      <div className="shared-navbar-inner">
        <Link to="/" className="brand">
          team<em>up</em>
          <span className="brand-dot" />
        </Link>

        <nav className="shared-nav-links">
          <Link to="/">Home</Link>
          <Link to="/explore">Directory</Link>
          <Link to="/create">Post Project</Link>
        </nav>

        <div className="shared-nav-actions">
          <Link to="/create" className="nav-post-btn">
            <Plus size={14} /> Post Project
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Join Modal (Persistent to MongoDB) ── */
interface JoinModalProps {
  project: Project;
  onClose: () => void;
  onRequestSubmitted: (newReq: JoinRequest) => void;
}

function JoinModal({ project, onClose, onRequestSubmitted }: JoinModalProps) {
  const [name, setName] = useState(() => localStorage.getItem("teamup_user_name") || "");
  const [email, setEmail] = useState(() => localStorage.getItem("teamup_user_email") || "");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please provide your name and email address.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const created = await createJoinRequest(project._id, {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      // Save user identity in localStorage so applicant view works automatically
      localStorage.setItem("teamup_user_name", name.trim());
      localStorage.setItem("teamup_user_email", email.trim().toLowerCase());

      onRequestSubmitted(created);
      setSubmitted(true);
    } catch {
      setError("Could not submit request. Please check that the server is running.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {submitted ? (
          <div className="modal-success">
            <CheckCircle size={44} />
            <h3>Proposal Dispatched</h3>
            <p>
              Your collaboration request for <strong>{project.title}</strong> has been
              recorded. {project.creatorName} and you can now review the application and its
              approval status directly on this page.
            </p>
            <button className="btn-primary" onClick={onClose} style={{ marginTop: 14 }}>
              Return to Project
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <h3>Request to Join</h3>
                <p>Send an intentional collaboration proposal to {project.creatorName}.</p>
              </div>
              <button
                onClick={onClose}
                style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-field">
                <label>Your Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                />
              </div>

              <div className="modal-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                />
              </div>

              <div className="modal-field">
                <label>How would you like to contribute? (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mention your relevant skillsets, GitHub profile, or why you'd like to work on this initiative..."
                />
              </div>

              {error && <p className="form-error">{error}</p>}

              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="modal-submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Proposal"}
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
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showJoin, setShowJoin] = useState(false);

  // Tab switch between Owner review and Applicant view
  const [viewMode, setViewMode] = useState<"owner" | "applicant">("owner");
  const [applicantEmail, setApplicantEmail] = useState(
    () => localStorage.getItem("teamup_user_email") || ""
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchProjectData = async (projectId: string) => {
    try {
      const [projData, reqData] = await Promise.all([
        getProject(projectId),
        getProjectRequests(projectId).catch(() => []),
      ]);
      setProject(projData);
      setRequests(reqData);
    } catch {
      setError("Project not found or server is unreachable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Invalid project ID.");
      setLoading(false);
      return;
    }
    fetchProjectData(id);
  }, [id]);

  const handleStatusUpdate = async (requestId: string, status: "Accepted" | "Rejected") => {
    setUpdatingId(requestId);
    try {
      const updated = await updateRequestStatus(requestId, status);
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: updated.status } : r))
      );
    } catch {
      alert("Failed to update status. Please ensure backend is running.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="explore-container" style={{ paddingTop: 70 }}>
          <p className="explore-message">Loading project archive...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="explore-container" style={{ paddingTop: 70 }}>
          <h2 style={{ marginBottom: 16 }}>{error || "Project Not Found"}</h2>
          <Link to="/explore" className="back-link">
            <ArrowLeft size={15} /> Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  const isOpen = project.status === "Open";
  const acceptedMembers = requests.filter((r) => r.status === "Accepted");
  const filteredUserRequests = applicantEmail.trim()
    ? requests.filter((r) => r.email.toLowerCase() === applicantEmail.trim().toLowerCase())
    : [];

  return (
    <>
      <div className="page-shell">
        <Navbar />

        <div className="explore-container" style={{ paddingTop: 40 }}>
          <Link to="/explore" className="back-link">
            <ArrowLeft size={14} /> Back to Directory
          </Link>

          {/* Main Details Card */}
          <section className="details-card">
            <span className="eyebrow">{project.category}</span>

            <h1>{project.title}</h1>

            <p>{project.description}</p>

            <h3>Required Technical Skills</h3>
            <div className="project-skills">
              {project.skillsRequired.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <h3>Target Roles</h3>
            <div className="project-skills">
              {project.lookingFor.map((role) => (
                <span key={role} style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
                  {role}
                </span>
              ))}
            </div>

            {/* Approved Team Members */}
            {acceptedMembers.length > 0 && (
              <>
                <h3>Confirmed Team Members ({acceptedMembers.length})</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                  {acceptedMembers.map((member) => (
                    <span key={member._id} className="accepted-team-badge">
                      <UserCheck size={14} style={{ color: "#386d42" }} />
                      <b>{member.name}</b> · {member.email}
                    </span>
                  ))}
                </div>
              </>
            )}

            <div className="details-meta">
              <span>
                <Users size={15} style={{ color: "var(--accent)" }} />
                Initiated by {project.creatorName}
              </span>
              <span>
                <Clock size={15} />
                {project.commitment} Engagement
              </span>
              <span className="status-badge">
                <span className="status-dot" />
                {project.status}
              </span>
            </div>
          </section>

          {/* Join Collaboration Box */}
          <div className="join-section" style={{ marginBottom: 40 }}>
            <div>
              <h3>Contribute to This Initiative</h3>
              <p>
                Connect directly with {project.creatorName} to request a spot on this team.
              </p>
            </div>
            {isOpen ? (
              <button className="join-btn" onClick={() => setShowJoin(true)}>
                <Briefcase size={15} /> Request to Join
              </button>
            ) : (
              <button className="join-btn" disabled>
                {project.status === "Completed" ? "Initiative Completed" : "Applications Closed"}
              </button>
            )}
          </div>

          {/* ── COLLABORATION REQUESTS & APPROVAL SECTION ── */}
          <section className="requests-section">
            <div className="requests-header">
              <div>
                <h3>Collaboration Proposals ({requests.length})</h3>
                <p>
                  Review candidate applications, approval decisions, and status updates.
                </p>
              </div>

              {/* View Toggle */}
              <div className="perspective-toggle">
                <button
                  type="button"
                  className={`perspective-btn ${viewMode === "owner" ? "active" : ""}`}
                  onClick={() => setViewMode("owner")}
                >
                  <ShieldCheck size={13} style={{ display: "inline", marginRight: 4, verticalAlign: -1 }} />
                  Owner View (Approvals)
                </button>
                <button
                  type="button"
                  className={`perspective-btn ${viewMode === "applicant" ? "active" : ""}`}
                  onClick={() => setViewMode("applicant")}
                >
                  <Users size={13} style={{ display: "inline", marginRight: 4, verticalAlign: -1 }} />
                  Applicant View
                </button>
              </div>
            </div>

            {/* ── Owner Review View ── */}
            {viewMode === "owner" && (
              <div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 18 }}>
                  As the project creator, you can review each incoming proposal and approve or decline requests.
                </p>

                {requests.length === 0 ? (
                  <div className="empty-requests">
                    No join requests submitted yet. When users apply, they will appear here for your review and approval.
                  </div>
                ) : (
                  <div className="requests-list">
                    {requests.map((req) => (
                      <div key={req._id} className="request-card">
                        <div className="request-card-top">
                          <div className="request-user-info">
                            <span className="request-avatar">
                              {req.name[0].toUpperCase()}
                            </span>
                            <div>
                              <h4>{req.name}</h4>
                              <span>{req.email} · Applied {new Date(req.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div>
                            {req.status === "Pending" && (
                              <span className="request-status-tag pending">
                                Pending Approval
                              </span>
                            )}
                            {req.status === "Accepted" && (
                              <span className="request-status-tag accepted">
                                <Check size={12} /> Approved Teammate
                              </span>
                            )}
                            {req.status === "Rejected" && (
                              <span className="request-status-tag rejected">
                                <X size={12} /> Declined
                              </span>
                            )}
                          </div>
                        </div>

                        {req.message && (
                          <div className="request-message">
                            "{req.message}"
                          </div>
                        )}

                        {/* Owner Approval Action Buttons */}
                        {req.status === "Pending" && (
                          <div className="request-actions">
                            <button
                              type="button"
                              className="btn-reject"
                              disabled={updatingId === req._id}
                              onClick={() => handleStatusUpdate(req._id, "Rejected")}
                            >
                              <XCircle size={14} /> Decline
                            </button>
                            <button
                              type="button"
                              className="btn-approve"
                              disabled={updatingId === req._id}
                              onClick={() => handleStatusUpdate(req._id, "Accepted")}
                            >
                              <Check size={14} /> Approve Teammate
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Applicant Status View ── */}
            {viewMode === "applicant" && (
              <div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14 }}>
                  Check the status of your join proposal using the email address you applied with:
                </p>

                <div className="applicant-lookup">
                  <input
                    type="email"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="Enter your email (e.g. alex@example.com)..."
                  />
                  {applicantEmail && (
                    <button
                      type="button"
                      className="btn-outline"
                      style={{ padding: "8px 14px", fontSize: 12 }}
                      onClick={() => setApplicantEmail("")}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {!applicantEmail.trim() ? (
                  <div className="empty-requests">
                    Please enter the email address you used when requesting to join, or click "Request to Join" above to submit a proposal.
                  </div>
                ) : filteredUserRequests.length === 0 ? (
                  <div className="empty-requests">
                    No submitted proposals found under <b>{applicantEmail}</b> for this project.
                  </div>
                ) : (
                  <div className="requests-list">
                    {filteredUserRequests.map((req) => (
                      <div key={req._id} className="request-card">
                        <div className="request-card-top">
                          <div className="request-user-info">
                            <span className="request-avatar">
                              {req.name[0].toUpperCase()}
                            </span>
                            <div>
                              <h4>Your Proposal to {project.creatorName}</h4>
                              <span>Submitted on {new Date(req.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div>
                            {req.status === "Pending" && (
                              <span className="request-status-tag pending">
                                ⏳ Pending Creator Review
                              </span>
                            )}
                            {req.status === "Accepted" && (
                              <span className="request-status-tag accepted">
                                🎉 Congratulations! Proposal Approved
                              </span>
                            )}
                            {req.status === "Rejected" && (
                              <span className="request-status-tag rejected">
                                Decision: Declined
                              </span>
                            )}
                          </div>
                        </div>

                        {req.message && (
                          <div className="request-message">
                            Your note: "{req.message}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {showJoin && (
        <JoinModal
          project={project}
          onClose={() => setShowJoin(false)}
          onRequestSubmitted={(newReq) => {
            setRequests((prev) => [newReq, ...prev]);
            setApplicantEmail(newReq.email);
          }}
        />
      )}
    </>
  );
}
