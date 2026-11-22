import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowUpRight,
  Users,
  Plus,
} from "lucide-react";

import { getProjects, type Project } from "../services/api";
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
          <Link to="/explore" className="active">Directory</Link>
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

/* ── Status Indicator ── */
function StatusBadge({ status }: { status: string }) {
  return (
    <span className="status-badge">
      <span className="status-dot" />
      {status}
    </span>
  );
}

/* ── Explore Page ── */
export default function Explore() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() =>
        setError(
          "Unable to load initiatives. Please verify the server connection."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const term = search.toLowerCase().trim();
    return projects.filter((p) => {
      const matchesSearch =
        !term ||
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.skillsRequired.some((s) => s.toLowerCase().includes(term)) ||
        p.lookingFor.some((r) => r.toLowerCase().includes(term));
      const matchesCategory = category === "All" || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [projects, search, category]);

  return (
    <div className="page-shell">
      <Navbar />

      <div className="explore-container">
        {/* Header */}
        <section className="explore-heading">
          <span className="eyebrow">— Directory</span>
          <h1>
            Discover <em>Initiatives</em>
          </h1>
          <p>
            Browse student & developer initiatives looking for collaborators.
            Filter by tech stack or category to find your next team.
          </p>
        </section>

        {/* Search */}
        <div className="explore-search">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, technologies, or skills (e.g. React, Python, Machine Learning)..."
          />
        </div>

        {/* Category Filters */}
        {!loading && !error && (
          <div className="explore-filters">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={`category-chip ${category === item ? "active" : ""}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* Results Metadata */}
        {!loading && !error && (
          <div className="explore-results">
            <div>
              <h2>Active Collaborations</h2>
              <p>
                Showing {filteredProjects.length} opportunit
                {filteredProjects.length === 1 ? "y" : "ies"}
              </p>
            </div>
            <span className="results-label">CURATED ARCHIVE</span>
          </div>
        )}

        {/* States */}
        {loading ? (
          <div className="skeleton-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="sk-line sk-short" />
                <div className="sk-line sk-title" />
                <div className="sk-line" />
                <div className="sk-line sk-long" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="explore-empty">
            <p style={{ color: "#a84232", fontSize: 14 }}>{error}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="explore-empty">
            <Search size={28} style={{ color: "var(--accent)" }} />
            <h3>No matching projects found</h3>
            <p>Try searching with another keyword or resetting the category filter.</p>
          </div>
        ) : (
          <div className="project-grid">
            {filteredProjects.map((project) => (
              <Link
                to={`/projects/${project._id}`}
                className="project-card-link"
                key={project._id}
                aria-label={`View project ${project.title}`}
              >
                <article className="project-card">
                  <div className="project-card-top">
                    <span className="project-category">{project.category}</span>
                    <StatusBadge status={project.status} />
                  </div>

                  <h3>{project.title}</h3>

                  <p className="project-desc">{project.description}</p>

                  <div className="skill-list">
                    {project.skillsRequired.slice(0, 4).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                    {project.skillsRequired.length > 4 && (
                      <span className="skill-more">
                        +{project.skillsRequired.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="card-footer-row">
                    <div className="card-creator">
                      <span className="creator-av">
                        {project.creatorName.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <b>{project.creatorName}</b>
                        <small>{project.commitment}</small>
                      </div>
                    </div>

                    <span className="card-cta-label">
                      <Users size={13} />
                      View Details
                      <ArrowUpRight size={13} />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Post CTA */}
        {!loading && !error && (
          <div style={{ textAlign: "center", marginTop: 70, borderTop: "1px solid var(--border)", paddingTop: 40 }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 18 }}>
              Looking for collaborators to bring your idea to life?
            </p>
            <Link to="/create" className="btn-primary">
              Post Your Project <ArrowUpRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
