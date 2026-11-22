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
  Sparkles,
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

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Curated Warm Editorial Software Project Visuals ─── */
const EDITORIAL_VISUALS = {
  left: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
  center: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
  right: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
};

/* ─── Home Page ─── */
function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "All",
    "Artificial Intelligence",
    "Web Development",
    "App Development",
    "Machine Learning",
    "Data Science",
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="app-shell">
      {/* ── NAVBAR ── */}
      <header className="navbar-wrap">
        <nav className="navbar">
          <Link to="/" className="brand">
            team<em>up</em>
            <span className="brand-dot" />
          </Link>

          <div className={`nav-links${menuOpen ? " nav-open" : ""}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/explore" onClick={() => setMenuOpen(false)}>Explore</Link>
            <a
              href="#vision"
              onClick={() => {
                document.getElementById("vision")?.scrollIntoView({ behavior: "smooth" });
                setMenuOpen(false);
              }}
            >
              Vision
            </a>
            <a
              href="#approach"
              onClick={() => {
                document.getElementById("approach")?.scrollIntoView({ behavior: "smooth" });
                setMenuOpen(false);
              }}
            >
              Approach
            </a>
            <Link to="/create" onClick={() => setMenuOpen(false)}>Post Project</Link>
          </div>

          <div className="nav-actions">
            <Link to="/explore" className="nav-ghost">Browse</Link>
            <Link to="/create" className="nav-cta">
              <Plus size={14} /> Post Project
            </Link>
          </div>

          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      <main>
        {/* ── EDITORIAL HERO SECTION ── */}
        <section className="hero">
          <span className="hero-super">
            — Curated Collaboration Network · Volume 01
          </span>

          <h1>
            Gathering Minds,
            <br />
            Shaping <em>Stories</em>
          </h1>

          <p className="hero-sub">
            Stop building in isolation. TeamUp connects students, designers, and
            developers around ambitious ideas — uniting complementary talents to craft
            software with intention and craft.
          </p>

          <div className="hero-actions">
            <Link to="/explore" className="btn-primary">
              Discover Projects <ArrowRight size={15} />
            </Link>
            <Link to="/create" className="btn-outline">
              Publish Your Idea <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* ── Reference Inspired 3-Panel Editorial Gallery ── */}
          <div className="hero-editorial-gallery">
            <div className="gallery-item side-left">
              <img
                src={EDITORIAL_VISUALS.left}
                alt="System Architecture and Codebase"
                loading="eager"
              />
              <div className="gallery-caption">
                <span>01 · Core Engineering</span>
                <span>Distributed Systems</span>
              </div>
            </div>

            <div className="gallery-item center-large">
              <img
                src={EDITORIAL_VISUALS.center}
                alt="Modern collaborative software build workspace"
                loading="eager"
              />
              <div className="gallery-caption">
                <span>02 · The Engineering Workspace</span>
                <span>Full-Stack Development</span>
              </div>
            </div>

            <div className="gallery-item side-right">
              <img
                src={EDITORIAL_VISUALS.right}
                alt="Product Interface and Design System"
                loading="eager"
              />
              <div className="gallery-caption">
                <span>03 · Product Design</span>
                <span>User Experience</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── MARQUEE TICKER RIBBON (Dynamic Sōl Haus Style) ── */}
        <div className="marquee-ribbon" aria-hidden="true">
          <div className="marquee-content">
            <span>
              DISCOVER TALENT <span className="marquee-dot">•</span> SHAPING SOFTWARE{" "}
              <span className="marquee-dot">•</span> <em>TIMELESS COLLABORATION</em>{" "}
              <span className="marquee-dot">•</span> BUILD TOGETHER{" "}
              <span className="marquee-dot">•</span> LAUNCH PRODUCTS{" "}
              <span className="marquee-dot">•</span> <em>TEAMUP NETWORK</em>{" "}
              <span className="marquee-dot">•</span>
            </span>
            <span>
              DISCOVER TALENT <span className="marquee-dot">•</span> SHAPING SOFTWARE{" "}
              <span className="marquee-dot">•</span> <em>TIMELESS COLLABORATION</em>{" "}
              <span className="marquee-dot">•</span> BUILD TOGETHER{" "}
              <span className="marquee-dot">•</span> LAUNCH PRODUCTS{" "}
              <span className="marquee-dot">•</span> <em>TEAMUP NETWORK</em>{" "}
              <span className="marquee-dot">•</span>
            </span>
          </div>
        </div>

        {/* ── VISION SECTION (Two-Column Asymmetric) ── */}
        <section className="vision-section" id="vision">
          <div className="vision-heading-area">
            <span className="vision-tag">— Vision</span>
            <h2>
              Timeless
              <br />
              <em>by Design</em>
            </h2>
          </div>

          <div className="vision-content-area">
            <p>
              At TeamUp, we believe projects should do more than just function — they
              should inspire. Each collaboration is a quiet dialogue between diverse
              skill sets, crafted with intentionality, clarity, and shared momentum.
            </p>
            <p>
              Rooted in the principles of warm minimalism and thoughtful engineering, our
              platform gives creators and students a quiet, elevated space to recruit
              teammates who care about quality as much as they do.
            </p>

            <div className="vision-stats-row">
              <div className="vision-stat-item">
                <b>
                  <Counter target={projects.length || 1} suffix="+" />
                </b>
                <span>Active Initiatives</span>
              </div>
              <div className="vision-stat-item">
                <b>
                  <Counter target={35} suffix="+" />
                </b>
                <span>Specialized Skills</span>
              </div>
              <div className="vision-stat-item">
                <b>
                  <em>100%</em>
                </b>
                <span>Open Collaboration</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURED PROJECTS ── */}
        <section className="projects-section" id="projects">
          <div className="section-header">
            <div>
              <span className="eyebrow">Curated Directory</span>
              <h2>Projects Worth Building.</h2>
              <p>Discover ideas looking for complementary hands, minds, and visions.</p>
            </div>
            <Link to="/explore" className="see-all-btn">
              Explore Complete Directory <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="category-scroller">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`category-chip ${activeCategory === c ? "active" : ""}`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
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
            ) : filteredProjects.length > 0 ? (
              filteredProjects.slice(0, 3).map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="project-card-link"
                  aria-label={`View project ${project.title}`}
                >
                  <article className="project-card">
                    <div className="project-card-top">
                      <span className="project-category">{project.category}</span>
                      <span className="status-badge">
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
                        <Users size={12} /> View Details <ArrowRight size={12} />
                      </span>
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <div className="empty-projects">
                <h3>No initiatives listed under this category</h3>
                <p>Be the pioneer to post a project in this domain.</p>
                <Link
                  to="/create"
                  className="btn-primary"
                  style={{ marginTop: 20, display: "inline-flex" }}
                >
                  Post Your Project <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── APPROACH / PROCESS (Sōl Haus "Our Approach" Inspired) ── */}
        <section className="approach-section" id="approach">
          <div className="approach-container">
            <div className="section-header centered">
              <span className="eyebrow">— Method</span>
              <h2>Our Approach to Team Formation</h2>
              <p>From initial concept to active development in three serene steps.</p>
            </div>

            <div className="steps-grid">
              {[
                {
                  n: "01",
                  icon: <Search size={20} />,
                  title: "Discover With Intention",
                  desc: "Browse curated technical concepts. Filter by stack, project goals, and open team positions.",
                },
                {
                  n: "02",
                  icon: <Sparkles size={20} />,
                  title: "Connect Meaningfully",
                  desc: "Send direct collaboration requests that detail your experience and how you envision contributing.",
                },
                {
                  n: "03",
                  icon: <Rocket size={20} />,
                  title: "Build & Ship Together",
                  desc: "Form your engineering unit, maintain momentum, and bring portfolio-defining work into the world.",
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
          </div>
        </section>

        {/* ── EDITORIAL CALL TO ACTION ── */}
        <section className="cta-section">
          <div className="cta-inner">
            <span className="eyebrow">— Next Chapter</span>
            <h2>
              Bring Intention
              <br />
              Into <em>Your Project</em>
            </h2>
            <p>
              The right collaborator transforms an idea into a masterpiece. Join builders
              crafting exceptional software on TeamUp.
            </p>
            <div className="cta-buttons">
              <Link to="/explore" className="btn-primary">
                Browse All Projects <ArrowRight size={15} />
              </Link>
              <Link to="/create" className="btn-outline">
                Submit an Idea <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <Link to="/" className="brand footer-brand">
              team<em>up</em>
              <span className="brand-dot" />
            </Link>
            <p className="footer-tagline" style={{ marginTop: 6 }}>
              A warm minimalist collaboration network for ambitious builders.
            </p>
          </div>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/explore">Directory</Link>
            <Link to="/create">Post Project</Link>
            <a href="#vision">Philosophy</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 TeamUp Network. All rights reserved.</span>
          <span>Crafted with intention and warm minimalism.</span>
        </div>
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
