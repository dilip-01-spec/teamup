import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Users,
  Rocket,
  Menu,
  X,
  Plus,
  Terminal,
} from "lucide-react";

import ProjectDetails from "./pages/ProjectDetails";
import Explore from "./pages/Explore";
import CreateProject from "./pages/CreateProject";
import { getProjects, type Project } from "./services/api";
import "./App.css";

/* ─── Animated Number Counter ─── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = Math.ceil(target / 40);
          const id = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(id);
            } else {
              setCount(start);
            }
          }, 30);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <strong ref={ref}>{count}{suffix}</strong>;
}

/* ─── Clean Typewriter Headline ─── */
const PHRASES = ["great people.", "bold builders.", "curious minds.", "your team."];
function Typewriter() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const pause = useRef(false);

  useEffect(() => {
    const phrase = PHRASES[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < phrase.length) {
      timeout = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === phrase.length) {
      if (!pause.current) {
        pause.current = true;
        timeout = setTimeout(() => {
          setDeleting(true);
          pause.current = false;
        }, 1800);
      }
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % PHRASES.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, phraseIdx]);

  return (
    <span className="typewriter-wrap">
      <span className="hero-highlight">{displayed}</span>
      <span className="caret" aria-hidden="true" />
    </span>
  );
}

/* ─── Home Page ─── */
function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-shell">
      {/* ── NAVBAR ── */}
      <header className="navbar-wrap">
        <nav className="navbar">
          <Link to="/" className="brand">
            team<span className="brand-highlight">up</span>
            <span className="brand-dot" />
          </Link>

          <div className={`nav-links${menuOpen ? " nav-open" : ""}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/explore" onClick={() => setMenuOpen(false)}>Explore</Link>
            <a
              href="#how-it-works"
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                setMenuOpen(false);
              }}
            >
              How it works
            </a>
            <Link to="/create" onClick={() => setMenuOpen(false)}>Post a project</Link>
          </div>

          <div className="nav-actions">
            <Link to="/explore" className="nav-ghost">Browse projects</Link>
            <Link to="/create" className="nav-cta">
              <Plus size={14} /> Post project
            </Link>
          </div>

          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      <main>
        {/* ── HERO SECTION ── */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-pill">
              <span className="hero-pill-dot" />
              <span>Project collaboration network</span>
            </div>

            <h1>
              Great ideas need
              <br />
              <Typewriter />
            </h1>

            <p className="hero-sub">
              Stop building in isolation. Discover active student and developer projects,
              connect with complementary skills, and build software that actually ships.
            </p>

            <div className="hero-buttons">
              <Link to="/explore" className="btn-primary">
                Explore projects <ArrowRight size={15} />
              </Link>
              <Link to="/create" className="btn-outline">
                Post your idea <ArrowUpRight size={15} />
              </Link>
            </div>

            <div className="hero-social-proof">
              <div className="avatar-stack">
                {["D", "A", "M", "S"].map((l, i) => (
                  <span key={i}>{l}</span>
                ))}
              </div>
              <div className="proof-text">
                <span>Active student & developer community</span>
                <span className="proof-live">
                  <span className="live-dot" />
                  Live projects available
                </span>
              </div>
            </div>
          </div>

          {/* ── Product Preview Card ── */}
          <div className="hero-visual">
            <div className="preview-card">
              <div className="preview-card-header">
                <div className="preview-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="preview-title">
                  <Terminal size={12} style={{ display: "inline", marginRight: 4, verticalAlign: -1 }} />
                  Discovery Canvas
                </div>
                <div style={{ width: 36 }} />
              </div>

              <div className="preview-card-body">
                <div className="preview-match-badge">
                  <span className="live-dot" />
                  Actively Recruiting Teammates
                </div>

                <div className="preview-project-info">
                  <h4>AI Study Assistant</h4>
                  <p>
                    Intelligent collaborative learning platform designed for students tackling
                    demanding technical topics.
                  </p>
                </div>

                <div>
                  <div className="preview-section-label">Skills Needed</div>
                  <div className="preview-tags">
                    <span className="preview-tag highlight">React</span>
                    <span className="preview-tag highlight">Python</span>
                    <span className="preview-tag">Machine Learning</span>
                    <span className="preview-tag">FastAPI</span>
                  </div>
                </div>

                <div>
                  <div className="preview-section-label">Open Positions</div>
                  <div className="preview-tags">
                    <span className="preview-tag highlight">Frontend Engineer</span>
                    <span className="preview-tag">AI/ML Specialist</span>
                  </div>
                </div>

                <div className="preview-team-status">
                  <div className="preview-team-user">
                    <span className="preview-team-avatar">D</span>
                    <div>
                      <b>Dilip</b>
                      <small>Project Creator · Flexible</small>
                    </div>
                  </div>
                  <span className="preview-status-pill">
                    <span className="live-dot" />
                    Open to Join
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS SECTION ── */}
        <section className="stats-section">
          <div className="stat-item">
            <Counter target={projects.length || 1} suffix="+" />
            <span>Active projects listed</span>
          </div>
          <div className="stat-item">
            <Counter target={30} suffix="+" />
            <span>Skill competencies</span>
          </div>
          <div className="stat-item">
            <Counter target={100} suffix="%" />
            <span>Open collaboration</span>
          </div>
          <div className="stat-item">
            <strong>∞</strong>
            <span>Possibilities to build</span>
          </div>
        </section>

        {/* ── FEATURED PROJECTS ── */}
        <section className="projects-section" id="projects">
          <div className="section-header">
            <div>
              <span className="eyebrow">Opportunities</span>
              <h2>Projects worth building.</h2>
              <p>Discover real initiatives actively searching for collaborators.</p>
            </div>
            <Link to="/explore" className="see-all-btn">
              Explore all <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="category-scroller">
            {[
              "Artificial Intelligence",
              "Web Development",
              "App Development",
              "Machine Learning",
              "Data Science",
              "Open Source",
            ].map((c) => (
              <Link key={c} to="/explore" className="category-pill">
                {c}
              </Link>
            ))}
          </div>

          <div className="project-grid">
            {loading ? (
              <div className="skeleton-grid">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton-card">
                    <div className="sk-line sk-short" />
                    <div className="sk-line sk-title" />
                    <div className="sk-line" />
                    <div className="sk-line sk-long" />
                  </div>
                ))}
              </div>
            ) : projects.length > 0 ? (
              projects.slice(0, 3).map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="project-card-link"
                  aria-label={`View project ${project.title}`}
                >
                  <article className="project-card">
                    <div className="project-card-top">
                      <span className="project-category">{project.category}</span>
                      <span className="status-badge status-open">
                        <span className="status-dot" />
                        {project.status}
                      </span>
                    </div>

                    <h3>{project.title}</h3>
                    <p className="project-desc">{project.description}</p>

                    <div className="skill-list">
                      {project.skillsRequired.slice(0, 3).map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                      {project.skillsRequired.length > 3 && (
                        <span className="skill-more">
                          +{project.skillsRequired.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="card-footer-row">
                      <div className="card-creator">
                        <span className="creator-av">
                          {project.creatorName[0].toUpperCase()}
                        </span>
                        <div>
                          <b>{project.creatorName}</b>
                          <small>{project.commitment}</small>
                        </div>
                      </div>
                      <span className="card-cta-label">
                        <Users size={12} /> View details <ArrowRight size={12} />
                      </span>
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <div className="empty-projects">
                <h3>No projects published yet</h3>
                <p>Be the first to share an idea and recruit teammates.</p>
                <Link
                  to="/create"
                  className="btn-primary"
                  style={{ marginTop: 16, display: "inline-flex" }}
                >
                  Post your project <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="how-section" id="how-it-works">
          <div className="section-header centered">
            <span className="eyebrow">Architecture</span>
            <h2>How collaboration works on TeamUp.</h2>
            <p>From initial concept to active development in three structured steps.</p>
          </div>

          <div className="steps-grid">
            {[
              {
                n: "01",
                icon: <Search size={20} />,
                title: "Discover Ideas",
                desc: "Explore projects filtered by technical domain, stack requirements, and roles being recruited.",
              },
              {
                n: "02",
                icon: <Users size={20} />,
                title: "Connect & Request",
                desc: "Send direct collaboration requests detailing your skills and how you want to contribute.",
              },
              {
                n: "03",
                icon: <Rocket size={20} />,
                title: "Build & Ship",
                desc: "Form your engineering unit, coordinate execution, and build portfolio-defining applications.",
              },
            ].map((step) => (
              <div key={step.n} className="step-card">
                <div className="step-num">{step.n}</div>
                <div className="step-icon-wrap">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
          <div className="cta-inner">
            <span className="eyebrow">Get Started</span>
            <h2>Ready to find your engineering team?</h2>
            <p>
              Join students and developers building meaningful software together on TeamUp.
            </p>
            <div className="cta-buttons">
              <Link to="/explore" className="btn-primary">
                Explore projects <ArrowRight size={15} />
              </Link>
              <Link to="/create" className="btn-outline">
                Post your idea <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <Link to="/" className="brand footer-brand">
          team<span className="brand-highlight">up</span>
          <span className="brand-dot" />
        </Link>
        <p className="footer-tagline">Project collaboration network for developers.</p>
        <div className="footer-links">
          <Link to="/explore">Explore</Link>
          <Link to="/create">Post a project</Link>
        </div>
        <span className="copyright">© 2026 TeamUp</span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/create" element={<CreateProject />} />
      </Routes>
    </BrowserRouter>
  );
}
