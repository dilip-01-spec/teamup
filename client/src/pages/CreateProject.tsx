import { useState, type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  X,
  CheckCircle,
} from "lucide-react";
import { createProject } from "../services/api";
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
          <Link to="/create" className="active">Post Project</Link>
        </nav>

        <div className="shared-nav-actions">
          <Link to="/explore" className="nav-ghost">
            Explore Directory
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Tag Input Component ── */
interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}

function TagInput({ tags, onChange, placeholder }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="tag-input-wrap">
      <div className="tag-input-row">
        {tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          className="tag-bare-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => input.trim() && addTag(input)}
          placeholder={tags.length === 0 ? placeholder : ""}
        />
      </div>
    </div>
  );
}

const CATEGORIES = [
  "Artificial Intelligence",
  "Web Development",
  "App Development",
  "Machine Learning",
  "Data Science",
  "Cybersecurity",
  "Game Development",
  "Open Source",
  "Design & Architecture",
  "DevOps & Systems",
  "Education",
  "FinTech",
  "Social Impact",
  "Other",
];

export default function CreateProject() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [creatorName, setCreatorName] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [commitment, setCommitment] = useState<"Part-time" | "Full-time" | "Flexible">("Flexible");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [createdId, setCreatedId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !category || !creatorName.trim()) {
      setError("Please fill in all mandatory fields marked with an asterisk (*).");
      return;
    }

    setSubmitting(true);
    try {
      const project = await createProject({
        title: title.trim(),
        description: description.trim(),
        category,
        skillsRequired: skills,
        lookingFor: roles,
        creatorName: creatorName.trim(),
        creatorEmail: creatorEmail.trim() || undefined,
        commitment,
      });
      setCreatedId(project._id);
      setSuccess(true);
    } catch {
      setError("Unable to publish initiative. Please ensure the backend is running on port 5001.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="create-page">
        <Navbar />
        <div className="create-container">
          <div className="create-success">
            <div className="create-success-icon">
              <CheckCircle size={32} />
            </div>
            <h2>Initiative Published with Intention</h2>
            <p>
              <strong>{title}</strong> is now live on the TeamUp network and discoverable
              by collaborators seeking ambitious work.
            </p>
            <div className="create-success-actions">
              <Link to={`/projects/${createdId}`} className="btn-primary">
                View Project Archive <ArrowRight size={15} />
              </Link>
              <button
                className="btn-outline"
                onClick={() => {
                  setSuccess(false);
                  setTitle("");
                  setDescription("");
                  setCategory("");
                  setSkills([]);
                  setRoles([]);
                  setCreatorName("");
                  setCreatorEmail("");
                  setCommitment("Flexible");
                }}
              >
                Post Another Project
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-page">
      <Navbar />

      <div className="create-container">
        {/* Header */}
        <div className="create-heading">
          <span className="eyebrow">
            <Plus size={12} /> New Initiative
          </span>
          <h1>
            Publish a <em>Project</em>
          </h1>
          <p>
            Outline your vision, specify the technical competencies required, and define
            the roles you are looking to assemble.
          </p>
        </div>

        {/* Form */}
        <form className="create-form" onSubmit={handleSubmit} noValidate>
          <p className="form-section-title">01 · Project Conception</p>

          <div className="form-row">
            <div className="form-field">
              <label>
                Project Title <span className="required">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Collaborative Spatial Design System"
                maxLength={90}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>
                Description <span className="required">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem, the core architecture, and what makes this initiative exciting..."
                maxLength={1200}
              />
            </div>
          </div>

          <div className="form-row cols-2">
            <div className="form-field">
              <label>
                Domain Category <span className="required">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>Select technical domain...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Time Commitment</label>
              <select
                value={commitment}
                onChange={(e) =>
                  setCommitment(e.target.value as "Part-time" | "Full-time" | "Flexible")
                }
              >
                <option value="Flexible">Flexible Engagement</option>
                <option value="Part-time">Part-time (5–15 hrs/wk)</option>
                <option value="Full-time">Full-time Commitment</option>
              </select>
            </div>
          </div>

          <p className="form-section-title">02 · Complementary Skillset</p>

          <div className="form-row">
            <div className="form-field">
              <label>Skills & Technologies Required</label>
              <TagInput
                tags={skills}
                onChange={setSkills}
                placeholder="Type skill & press Enter (e.g. React, Python, Three.js)..."
              />
              <span className="tag-hint">Press Enter or comma to add each skill badge.</span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Target Team Roles</label>
              <TagInput
                tags={roles}
                onChange={setRoles}
                placeholder="Type role & press Enter (e.g. Frontend Engineer, Product Designer)..."
              />
              <span className="tag-hint">Press Enter or comma to add each target role.</span>
            </div>
          </div>

          <p className="form-section-title">03 · Initiator Details</p>

          <div className="form-row cols-2">
            <div className="form-field">
              <label>
                Your Name <span className="required">*</span>
              </label>
              <input
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="e.g. Dilip"
              />
            </div>

            <div className="form-field">
              <label>Contact Email (optional)</label>
              <input
                type="email"
                value={creatorEmail}
                onChange={(e) => setCreatorEmail(e.target.value)}
                placeholder="e.g. dilip@example.com"
              />
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="create-actions">
            <button
              type="button"
              className="create-cancel"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button type="submit" className="create-submit" disabled={submitting}>
              {submitting ? "Publishing..." : (
                <>Publish Initiative <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
