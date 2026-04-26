import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────── CONSTANTS & DATA ─────────────────────────── */

const NAV_LINKS = ["Home","About","Experience","Portfolio","Skills","Contact"];

const STATS = [
  { value: "5+", label: "Years of Writing Experience" },
  { value: "30+", label: "Published Articles" },
  { value: "10+", label: "Projects Completed" },
  { value: "100%", label: "Commitment to Impact" },
];

const EXPERIENCE_DATA = [
  {
    role: "Editor-in-Chief, Infocus News Agency (OAU)",
    period: "2022 – 2023",
    points: [
      "Guided reporters to cover stories around the faculty",
      "Edited the reports and fact-checked them for accuracy",
      "Edited and published news articles on the agency's websites",
    ],
  },
  {
    role: "Reporter, Association of Campus Journalists (ACJ), OAU, Ile-Ife",
    period: "2022 – 2023",
    points: [
      "Covered the students' union election in 2022",
      "Worked with other editors to fact-check the results of the election and other campus events",
    ],
  },
  {
    role: "News Writer, Infocus News Agency, Ile-Ife, Osun State",
    period: "2018 – 2023",
    points: [
      "Reported stories and wrote news on them",
      "Covered stories around lifestyle, entertainment, religion, fashion and sport",
    ],
  },
  {
    role: "Reporter, Progress F.M. 100.5, Ado-Ekiti, Ekiti State",
    period: "2015",
    points: [
      "Covered stories related to students' riots in EKSU, Ado-Ekiti, Ekiti State",
      "Gathered news across the federation and submitted it for review",
    ],
  },
  {
    role: "Content Writer, BayoSpeaks",
    period: "2023 – 2024",
    points: [
      "Created content calendar for two months",
      "Collaborated to write short stories on the dehumanisation of the female gender",
      "Transcribed and translated personal stories of dehumanisation while still maintaining the brand voice",
    ],
  },
];

const VOLUNTEER_DATA = [
  { role: "Social Media Manager", org: "Emprinte Readers Hub", period: "2021 – 2022" },
  { role: "Social Media Manager", org: "Women of Might Organisation", period: "2022 – 2023" },
];

const EDUCATION_DATA = [
  { school: "Obafemi Awolowo University", location: "Ile-Ife, Osun State", period: "2018 – 2023", degree: "B.A. (Ed.) Education and English" },
  { school: "Olabisi Onabanjo University", location: "Ago-Iwoye, Ogun State", period: "2015 – 2019", degree: "B.A. Religious Studies" },
];

const PORTFOLIO_ITEMS = [
  { title: "Students' Union Election Coverage", category: "News Articles", desc: "In-depth coverage and fact-check of the 2022 OAU Students' Union election." },
  { title: "The Dehumanisation of the Female Gender", category: "Features", desc: "Short stories that highlight real experiences and advocate for change." },
  { title: "Students' Riots in EKSU, Ado-Ekiti", category: "News Articles", desc: "On-ground reporting of the students' riot and its impact on the institution." },
  { title: "Content Calendar & Brand Stories", category: "Content Writing", desc: "Content strategy, storytelling and transcribing for BayoSpeaks." },
  { title: "Religion & Lifestyle Stories", category: "Features", desc: "Exploring the intersection of faith, culture, and everyday life in campus communities." },
  { title: "Fashion & Entertainment", category: "Features", desc: "Covering trends, events, and cultural moments across campus life." },
];

const CATEGORIES = ["All","News Articles","Features","Reports","Content Writing"];

const SKILLS_DATA = [
  { name: "Excellent Communication", percent: 95, icon: "💬" },
  { name: "Creative Writing", percent: 90, icon: "✍️" },
  { name: "Brand Storytelling", percent: 90, icon: "📖" },
  { name: "SEO / AEO", percent: 85, icon: "🔍" },
  { name: "Critical Thinking", percent: 90, icon: "🧠" },
  { name: "Problem Solving", percent: 85, icon: "🎯" },
];

const WHAT_I_DO = [
  { title: "News Writing", icon: "📰" },
  { title: "Editing & Proofreading", icon: "✏️" },
  { title: "Feature Writing", icon: "📝" },
  { title: "Content Strategy", icon: "📊" },
  { title: "Transcription & Translation", icon: "🌐" },
  { title: "Social Media Management", icon: "📱" },
];

/* ─────────────────────────── HOOK: Intersection Observer ─────────────────────────── */

function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.unobserve(el); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─────────────────────────── ANIMATED WRAPPER ─────────────────────────── */

function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, inView] = useInView();
  const transforms = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)", none: "none" };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : transforms[direction],
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────── COUNTER ANIMATION ─────────────────────────── */

function AnimatedStat({ value, label, delay }) {
  const [ref, inView] = useInView();
  const [display, setDisplay] = useState("0");
  const numericPart = parseInt(value);
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = numericPart;
    const duration = 1500;
    const startTime = performance.now();
    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * end).toString());
      if (progress < 1) requestAnimationFrame(tick);
    }
    const timer = setTimeout(() => requestAnimationFrame(tick), delay * 1000);
    return () => clearTimeout(timer);
  }, [inView]);

  return (
    <div ref={ref} className="stat-item" style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: `all 0.6s ease ${delay}s` }}>
      <span className="stat-value">{display}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

/* ─────────────────────────── SKILL BAR ─────────────────────────── */

function SkillBar({ name, percent, icon, delay }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className="skill-bar-item" style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateX(-20px)", transition: `all 0.5s ease ${delay}s` }}>
      <div className="skill-bar-header">
        <span className="skill-icon">{icon}</span>
        <span className="skill-name">{name}</span>
        <span className="skill-percent">{percent}%</span>
      </div>
      <div className="skill-bar-track">
        <div className="skill-bar-fill" style={{ width: inView ? `${percent}%` : "0%", transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${delay + 0.3}s` }} />
      </div>
    </div>
  );
}

/* ─────────────────────────── PORTFOLIO MODAL ─────────────────────────── */

function PortfolioModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-badge">{item.category}</div>
        <h2 className="modal-title">{item.title}</h2>
        <p className="modal-desc">{item.desc}</p>
        <div className="modal-details">
          <p>This piece represents Dorcas's commitment to impactful storytelling. Through careful research, on-ground reporting, and a deep understanding of the subject matter, this work exemplifies the kind of journalism that drives positive change.</p>
          <div className="modal-meta">
            <span>Category: {item.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── MAIN APP ─────────────────────────── */

export default function DorcasPortfolio() {
  const [dark, setDark] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Contact form state
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle"); // idle | sending | success | error
  const [formError, setFormError] = useState("");

  // ⚠️ REPLACE THIS with your deployed Google Apps Script URL
  const APPS_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL_HERE";

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async () => {
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormError("Please fill in your name, email, and message.");
      setFormStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError("Please enter a valid email address.");
      setFormStatus("error");
      return;
    }

    setFormStatus("sending");
    setFormError("");

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" }, // Apps Script quirk — avoids CORS preflight
        body: JSON.stringify(formData),
      });

      // Apps Script redirects, so we handle both cases
      if (res.ok || res.type === "opaque") {
        setFormStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to send message.");
      }
    } catch (err) {
      // If using no-cors mode, we can't read the response — assume success
      if (err.message.includes("Failed to fetch")) {
        // Likely CORS — try no-cors fallback
        try {
          await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(formData),
          });
          setFormStatus("success");
          setFormData({ name: "", email: "", subject: "", message: "" });
        } catch {
          setFormStatus("error");
          setFormError("Network error. Please check your connection and try again.");
        }
      } else {
        setFormStatus("error");
        setFormError(err.message || "Something went wrong. Please try again.");
      }
    }
  };

  // Loading screen
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 1800); return () => clearTimeout(t); }, []);

  // Parallax scroll tracking
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Active section tracking
  useEffect(() => {
    const sections = NAV_LINKS.map(id => document.getElementById(id));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" });
    sections.forEach(s => s && obs.observe(s));
    return () => obs.disconnect();
  }, [loaded]);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  }, []);

  const filteredPortfolio = activeFilter === "All" ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter(p => p.category === activeFilter);

  const t = dark ? "dark" : "light";

  /* ─── Loading Screen ─── */
  if (!loaded) {
    return (
      <div className={`loader-screen ${t}`}>
        <style>{getStyles()}</style>
        <div className="loader-content">
          <div className="loader-line" />
          <h1 className="loader-name">Dorcas Eniitan Ajayi</h1>
          <p className="loader-sub">Writer • Journalist • Educator</p>
          <div className="loader-bar"><div className="loader-bar-fill" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`app ${t}`}>
      <style>{getStyles()}</style>

      {/* ══════════ NAVBAR ══════════ */}
      <nav className="navbar">
        <div className="nav-inner">
          <div className="nav-brand" onClick={() => scrollTo("Home")}>
            <span className="brand-name">Dorcas Ajayi</span>
            <span className="brand-sub">Writer • Journalist • Educator</span>
          </div>
          <div className={`nav-links ${mobileMenu ? "open" : ""}`}>
            {NAV_LINKS.map(link => (
              <button key={link} className={`nav-link ${activeSection === link ? "active" : ""}`} onClick={() => scrollTo(link)}>{link}</button>
            ))}
            <button className="nav-cta" onClick={() => scrollTo("Contact")}>Let's Connect</button>
          </div>
          <div className="nav-actions">
            <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle theme">
              {dark ? "☀️" : "🌙"}
            </button>
            <button className="hamburger" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
              <span className={`ham-line ${mobileMenu ? "open" : ""}`} />
              <span className={`ham-line ${mobileMenu ? "open" : ""}`} />
              <span className={`ham-line ${mobileMenu ? "open" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════ HERO / HOME ══════════ */}
      <section id="Home" className="hero-section">
        <div className="hero-inner">
          <div className="hero-text">
            <Reveal delay={0.1}>
              <span className="hero-greeting">Hi, I'm</span>
            </Reveal>
            <Reveal delay={0.2}>
              <h1 className="hero-name">Dorcas<br/>Eniitan Ajayi</h1>
            </Reveal>
            <Reveal delay={0.35}>
              <p className="hero-title">Impact-driven Educator, Writer & Journalist</p>
            </Reveal>
            <Reveal delay={0.45}>
              <p className="hero-desc">I tell stories that inform, inspire and create impact. Passionate about speaking truth, amplifying voices, and driving positive change through the power of words.</p>
            </Reveal>
            <Reveal delay={0.55}>
              <div className="hero-actions">
                <button className="btn-primary" onClick={() => scrollTo("Portfolio")}>View My Work →</button>
                <button className="btn-secondary">Download CV ↓</button>
              </div>
            </Reveal>
            <Reveal delay={0.65}>
              <div className="hero-socials">
                <a href="#" className="social-icon" aria-label="LinkedIn">in</a>
                <a href="#" className="social-icon" aria-label="Twitter">𝕏</a>
                <a href="#" className="social-icon" aria-label="Medium">M</a>
                <a href="#" className="social-icon" aria-label="Email">✉</a>
              </div>
            </Reveal>
          </div>
          <div className="hero-image-wrap" style={{ transform: `translateY(${scrollY * 0.08}px)` }}>
            <div className="hero-image-container">
              <div className="hero-img-placeholder">
                <span className="placeholder-initials">DA</span>
              </div>
              <div className="hero-quote-card">
                <span className="quote-mark">"</span>
                <p>Every story has the power to spark change. I just find the right words to tell it.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Work Preview */}
        <div className="featured-section">
          <div className="featured-header">
            <Reveal><h2 className="section-label">Featured Work</h2></Reveal>
            <Reveal delay={0.1}><button className="text-link" onClick={() => scrollTo("Portfolio")}>View All Work →</button></Reveal>
          </div>
          <div className="featured-grid">
            {PORTFOLIO_ITEMS.slice(0, 3).map((item, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <div className="featured-card" onClick={() => setSelectedItem(item)}>
                  <div className="card-img-area">
                    <span className="card-badge">{item.category}</span>
                  </div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-desc">{item.desc}</p>
                  <span className="card-link">Read More →</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ ABOUT ══════════ */}
      <section id="About" className="section about-section">
        <div className="section-inner">
          <Reveal><span className="section-tag">About Me</span></Reveal>
          <Reveal delay={0.1}><h2 className="section-heading">Purpose. Passion. Impact.</h2></Reveal>
          <div className="about-grid">
            <div className="about-text-col">
              <Reveal delay={0.2}>
                <p className="about-para">I am a writer, journalist and educator with a strong background in news reporting, editing, content creation and brand storytelling.</p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="about-para">My journey has been driven by a passion for truth, storytelling and the desire to make a difference.</p>
              </Reveal>
              <Reveal delay={0.4}>
                <p className="about-para">I believe in the power of words to inform, educate and transform lives.</p>
              </Reveal>
            </div>
            <div className="about-image-col">
              <Reveal delay={0.3} direction="left">
                <div className="about-img-placeholder">
                  <span className="placeholder-initials">DA</span>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-row">
            {STATS.map((s, i) => <AnimatedStat key={i} value={s.value} label={s.label} delay={0.1 * i} />)}
          </div>

          {/* Education */}
          <Reveal><h3 className="sub-heading">Education</h3></Reveal>
          <div className="edu-grid">
            {EDUCATION_DATA.map((ed, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <div className="edu-card">
                  <div className="edu-icon">🎓</div>
                  <h4 className="edu-school">{ed.school}</h4>
                  <p className="edu-location">{ed.location}</p>
                  <p className="edu-period">{ed.period}</p>
                  <p className="edu-degree">{ed.degree}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ EXPERIENCE ══════════ */}
      <section id="Experience" className="section exp-section">
        <div className="section-inner">
          <Reveal><h2 className="section-heading">Experience</h2></Reveal>
          <div className="timeline">
            {EXPERIENCE_DATA.map((exp, i) => (
              <Reveal key={i} delay={0.1 * i} direction={i % 2 === 0 ? "left" : "right"}>
                <div className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h3 className="timeline-role">{exp.role}</h3>
                      <span className="timeline-period">{exp.period}</span>
                    </div>
                    <ul className="timeline-points">
                      {exp.points.map((p, j) => <li key={j}>{p}</li>)}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Volunteer */}
          <Reveal><h3 className="sub-heading" style={{ marginTop: "3rem" }}>Volunteer</h3></Reveal>
          <div className="volunteer-grid">
            {VOLUNTEER_DATA.map((v, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <div className="volunteer-card">
                  <h4>{v.role}</h4>
                  <p>{v.org}</p>
                  <span className="vol-period">{v.period}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PORTFOLIO ══════════ */}
      <section id="Portfolio" className="section portfolio-section">
        <div className="section-inner">
          <Reveal><h2 className="section-heading">Portfolio</h2></Reveal>
          <Reveal delay={0.1}>
            <div className="filter-row">
              {CATEGORIES.map(cat => (
                <button key={cat} className={`filter-btn ${activeFilter === cat ? "active" : ""}`} onClick={() => setActiveFilter(cat)}>{cat}</button>
              ))}
            </div>
          </Reveal>
          <div className="portfolio-grid">
            {filteredPortfolio.map((item, i) => (
              <Reveal key={item.title} delay={0.08 * i}>
                <div className="portfolio-card" onClick={() => setSelectedItem(item)}>
                  <div className="pcard-img">
                    <span className="card-badge">{item.category}</span>
                  </div>
                  <h3 className="pcard-title">{item.title}</h3>
                  <span className="card-link">Read More →</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ SKILLS ══════════ */}
      <section id="Skills" className="section skills-section">
        <div className="section-inner">
          <Reveal><h2 className="section-heading">Skills & Expertise</h2></Reveal>
          <div className="skills-grid">
            <div className="skills-bars-col">
              <Reveal><h3 className="sub-heading">Core Skills</h3></Reveal>
              {SKILLS_DATA.map((s, i) => <SkillBar key={s.name} {...s} delay={0.1 * i} />)}
            </div>
            <div className="skills-cards-col">
              <Reveal><h3 className="sub-heading">What I Do Best</h3></Reveal>
              <div className="wid-grid">
                {WHAT_I_DO.map((w, i) => (
                  <Reveal key={i} delay={0.08 * i}>
                    <div className="wid-card">
                      <span className="wid-icon">{w.icon}</span>
                      <span className="wid-title">{w.title}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CONTACT ══════════ */}
      <section id="Contact" className="section contact-section">
        <div className="section-inner">
          <Reveal><h2 className="section-heading">Let's Work Together</h2></Reveal>
          <Reveal delay={0.1}><p className="contact-intro">I am open to collaborations, writing opportunities and impactful projects. Feel free to reach out!</p></Reveal>
          <div className="contact-grid">
            <div className="contact-info-col">
              <Reveal delay={0.15}>
                <div className="contact-item"><span className="ci-icon">✉</span><div><strong>Email</strong><p>ajayidorcas@gmail.com</p></div></div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="contact-item"><span className="ci-icon">📞</span><div><strong>Phone</strong><p>+234 816 123 4567</p></div></div>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="contact-item"><span className="ci-icon">in</span><div><strong>LinkedIn</strong><p>linkedin.com/in/ajayidorcas</p></div></div>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="hero-socials" style={{ marginTop: "1.5rem" }}>
                  <a href="#" className="social-icon">in</a>
                  <a href="#" className="social-icon">𝕏</a>
                  <a href="#" className="social-icon">M</a>
                  <a href="#" className="social-icon">✉</a>
                </div>
              </Reveal>
            </div>
            <div className="contact-form-col">
              <Reveal delay={0.2} direction="left">
                <div className="contact-form-wrap">
                  {formStatus === "success" ? (
                    <div className="form-success">
                      <div className="success-icon">✓</div>
                      <h3 className="success-title">Message Sent!</h3>
                      <p className="success-text">Thank you for reaching out. I've sent a confirmation to your email. I'll get back to you within 24–48 hours.</p>
                      <button className="btn-secondary" onClick={() => setFormStatus("idle")} style={{ marginTop: "1rem" }}>Send Another Message</button>
                    </div>
                  ) : (
                    <>
                      <input type="text" name="name" placeholder="Your Name" className="form-input" value={formData.name} onChange={handleFormChange} disabled={formStatus === "sending"} />
                      <input type="email" name="email" placeholder="Email Address" className="form-input" value={formData.email} onChange={handleFormChange} disabled={formStatus === "sending"} />
                      <input type="text" name="subject" placeholder="Subject" className="form-input" value={formData.subject} onChange={handleFormChange} disabled={formStatus === "sending"} />
                      <textarea name="message" placeholder="Your Message" rows={5} className="form-input form-textarea" value={formData.message} onChange={handleFormChange} disabled={formStatus === "sending"} />
                      {formStatus === "error" && <p className="form-error">{formError}</p>}
                      <button className={`btn-submit ${formStatus === "sending" ? "sending" : ""}`} onClick={handleFormSubmit} disabled={formStatus === "sending"}>
                        {formStatus === "sending" ? (
                          <><span className="spinner" /> Sending...</>
                        ) : (
                          "Send Message ✈"
                        )}
                      </button>
                    </>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <strong>Dorcas Eniitan Ajayi</strong>
            <span>Writer • Journalist • Impact-driven Educator</span>
          </div>
          <div className="footer-socials">
            <a href="#" className="social-icon sm">in</a>
            <a href="#" className="social-icon sm">𝕏</a>
            <a href="#" className="social-icon sm">M</a>
            <a href="#" className="social-icon sm">✉</a>
          </div>
          <span className="footer-copy">© 2024 All Rights Reserved.</span>
        </div>
      </footer>

      {/* Modal */}
      <PortfolioModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════════════════ */

function getStyles() {
  return `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');

:root {
  /* Light theme */
  --bg: #FAFAF8;
  --bg-alt: #F3F0ED;
  --bg-card: #FFFFFF;
  --text: #1A1A1A;
  --text-secondary: #5A5A5A;
  --text-muted: #8A8A8A;
  --plum: #3D1F3E;
  --plum-light: #5C3A5E;
  --rose: #C4A0A5;
  --rose-light: #E8D5D8;
  --accent: #3D1F3E;
  --border: #E8E4E0;
  --glass: rgba(255,255,255,0.7);
  --shadow: 0 4px 24px rgba(61,31,62,0.08);
  --shadow-hover: 0 8px 40px rgba(61,31,62,0.14);
  --card-radius: 12px;
}

.dark {
  --bg: #121014;
  --bg-alt: #1A171E;
  --bg-card: #221F26;
  --text: #F0ECE8;
  --text-secondary: #B8B0B8;
  --text-muted: #787078;
  --plum: #D4A0D8;
  --plum-light: #E0B8E4;
  --accent: #D4A0D8;
  --border: #2E2A32;
  --glass: rgba(18,16,20,0.7);
  --shadow: 0 4px 24px rgba(0,0,0,0.3);
  --shadow-hover: 0 8px 40px rgba(0,0,0,0.5);
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Source Sans 3', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.7;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.app {
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  transition: background 0.4s ease, color 0.4s ease;
}

/* ─── Loader ─── */
.loader-screen {
  display: flex; align-items: center; justify-content: center;
  height: 100vh; width: 100vw;
  background: var(--bg);
  position: fixed; top: 0; left: 0; z-index: 9999;
}
.loader-content { text-align: center; }
.loader-line {
  width: 40px; height: 3px; background: var(--plum); margin: 0 auto 1.5rem;
  animation: loaderExpand 1.5s ease forwards;
}
@keyframes loaderExpand { to { width: 100px; } }
.loader-name {
  font-family: 'Playfair Display', serif;
  font-size: 2rem; font-weight: 600; color: var(--text);
  animation: fadeUp 0.8s ease 0.3s both;
}
.loader-sub {
  color: var(--text-muted); font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; margin-top: 0.5rem;
  animation: fadeUp 0.8s ease 0.5s both;
}
.loader-bar { width: 180px; height: 2px; background: var(--border); margin: 2rem auto 0; border-radius: 2px; overflow: hidden; }
.loader-bar-fill { width: 100%; height: 100%; background: var(--plum); animation: loaderFill 1.5s ease forwards; transform-origin: left; }
@keyframes loaderFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

/* ─── Navbar ─── */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: var(--glass);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  transition: background 0.3s;
}
.nav-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.75rem 2rem;
}
.nav-brand { cursor: pointer; }
.brand-name { font-family: 'Playfair Display', serif; font-weight: 600; font-size: 1.15rem; display: block; color: var(--text); }
.brand-sub { font-size: 0.65rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); }
.nav-links { display: flex; align-items: center; gap: 0.25rem; }
.nav-link {
  background: none; border: none; color: var(--text-secondary); font-family: 'Source Sans 3', sans-serif;
  font-size: 0.85rem; padding: 0.4rem 0.75rem; cursor: pointer; border-radius: 6px;
  transition: all 0.25s;
}
.nav-link:hover, .nav-link.active { color: var(--plum); background: var(--bg-alt); }
.nav-link.active { font-weight: 600; }
.nav-cta {
  background: var(--plum); color: #fff; border: none; padding: 0.5rem 1.25rem;
  border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer;
  font-family: 'Source Sans 3', sans-serif;
  transition: all 0.3s; margin-left: 0.5rem;
}
.nav-cta:hover { opacity: 0.9; transform: translateY(-1px); }
.nav-actions { display: flex; align-items: center; gap: 0.5rem; }
.theme-toggle {
  background: none; border: 1px solid var(--border); width: 36px; height: 36px;
  border-radius: 8px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center;
  transition: all 0.25s;
}
.theme-toggle:hover { background: var(--bg-alt); }
.hamburger {
  display: none; flex-direction: column; gap: 4px; background: none; border: none;
  cursor: pointer; padding: 6px;
}
.ham-line {
  width: 20px; height: 2px; background: var(--text); border-radius: 2px;
  transition: all 0.3s;
}
.ham-line.open:nth-child(1) { transform: rotate(45deg) translate(4px, 4px); }
.ham-line.open:nth-child(2) { opacity: 0; }
.ham-line.open:nth-child(3) { transform: rotate(-45deg) translate(4px, -4px); }

/* ─── Hero ─── */
.hero-section { padding: 8rem 2rem 4rem; max-width: 1200px; margin: 0 auto; }
.hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; min-height: 60vh; }
.hero-greeting { color: var(--plum); font-weight: 600; font-size: 1.1rem; letter-spacing: 1px; }
.hero-name {
  font-family: 'Playfair Display', serif; font-size: 3.8rem; font-weight: 700;
  line-height: 1.1; margin: 0.5rem 0 1rem; color: var(--text);
}
.hero-title { font-weight: 600; font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 1rem; }
.hero-desc { color: var(--text-secondary); font-size: 0.95rem; max-width: 440px; line-height: 1.8; }
.hero-actions { display: flex; gap: 1rem; margin-top: 1.75rem; flex-wrap: wrap; }
.btn-primary {
  background: var(--plum); color: #fff; border: none; padding: 0.75rem 1.75rem;
  border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer;
  font-family: 'Source Sans 3', sans-serif;
  transition: all 0.3s; display: flex; align-items: center; gap: 0.5rem;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(61,31,62,0.25); }
.btn-secondary {
  background: transparent; border: 1.5px solid var(--plum); color: var(--plum);
  padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem;
  cursor: pointer; font-family: 'Source Sans 3', sans-serif; transition: all 0.3s;
  display: flex; align-items: center; gap: 0.5rem;
}
.btn-secondary:hover { background: var(--plum); color: #fff; }
.hero-socials { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
.social-icon {
  width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-secondary); text-decoration: none; font-size: 0.8rem; font-weight: 700;
  transition: all 0.3s;
}
.social-icon:hover { background: var(--plum); color: #fff; border-color: var(--plum); }
.social-icon.sm { width: 32px; height: 32px; font-size: 0.75rem; }

/* Hero Image */
.hero-image-wrap { display: flex; justify-content: center; }
.hero-image-container { position: relative; }
.hero-img-placeholder {
  width: 360px; height: 420px; border-radius: 20px;
  background: linear-gradient(135deg, var(--plum) 0%, var(--plum-light) 100%);
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow);
}
.placeholder-initials {
  font-family: 'Playfair Display', serif; font-size: 4rem; font-weight: 700; color: rgba(255,255,255,0.3);
}
.hero-quote-card {
  position: absolute; bottom: -20px; left: -40px;
  background: var(--bg-card); border: 1px solid var(--border);
  padding: 1.25rem 1.5rem; border-radius: 12px; max-width: 220px;
  box-shadow: var(--shadow); font-size: 0.8rem; color: var(--text-secondary);
  font-style: italic; line-height: 1.6;
}
.quote-mark {
  font-family: 'Playfair Display', serif; font-size: 2.5rem; color: var(--plum);
  line-height: 0; position: relative; top: 10px;
}

/* ─── Featured ─── */
.featured-section { margin-top: 5rem; padding-top: 3rem; border-top: 1px solid var(--border); }
.featured-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.section-label { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 600; }
.text-link { background: none; border: none; color: var(--plum); font-weight: 600; font-size: 0.9rem; cursor: pointer; font-family: 'Source Sans 3', sans-serif; }
.featured-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.featured-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--card-radius);
  overflow: hidden; cursor: pointer; transition: all 0.35s;
}
.featured-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
.card-img-area {
  height: 140px;
  background: linear-gradient(135deg, var(--rose-light, #E8D5D8) 0%, var(--bg-alt) 100%);
  position: relative; display: flex; align-items: flex-start; padding: 0.75rem;
}
.card-badge {
  background: var(--plum); color: #fff; font-size: 0.65rem; font-weight: 600;
  padding: 0.25rem 0.65rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;
}
.card-title { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; padding: 1rem 1rem 0.25rem; }
.card-desc { font-size: 0.8rem; color: var(--text-secondary); padding: 0 1rem; line-height: 1.6; }
.card-link {
  display: inline-block; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 600;
  color: var(--plum); transition: all 0.25s;
}
.card-link:hover { transform: translateX(4px); }

/* ─── Sections ─── */
.section { padding: 5rem 2rem; }
.section-inner { max-width: 1200px; margin: 0 auto; }
.section-tag {
  display: inline-block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 2px; color: var(--plum); margin-bottom: 0.75rem;
  padding-bottom: 0.5rem; border-bottom: 2px solid var(--plum);
}
.section-heading {
  font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 700; margin-bottom: 2.5rem;
  color: var(--text);
}
.sub-heading {
  font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 600;
  margin-bottom: 1.5rem; color: var(--text);
}

/* ─── About ─── */
.about-section { background: var(--bg-alt); }
.about-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3rem; margin-bottom: 3rem; }
.about-para { color: var(--text-secondary); font-size: 1rem; margin-bottom: 1rem; line-height: 1.9; }
.about-img-placeholder {
  width: 100%; aspect-ratio: 3/4; border-radius: 16px;
  background: linear-gradient(135deg, var(--plum) 0%, var(--plum-light) 100%);
  display: flex; align-items: center; justify-content: center;
}
.stats-row {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--card-radius);
  padding: 2rem; margin-bottom: 3rem;
}
.stat-item { text-align: center; }
.stat-value { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 700; color: var(--plum); display: block; }
.stat-label { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; display: block; }
.edu-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
.edu-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--card-radius);
  padding: 1.5rem; transition: all 0.3s;
}
.edu-card:hover { box-shadow: var(--shadow); }
.edu-icon { font-size: 1.5rem; margin-bottom: 0.75rem; }
.edu-school { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 600; margin-bottom: 0.25rem; }
.edu-location { font-size: 0.85rem; color: var(--text-muted); }
.edu-period { font-size: 0.8rem; color: var(--plum); font-weight: 600; margin: 0.25rem 0; }
.edu-degree { font-size: 0.85rem; color: var(--text-secondary); }

/* ─── Experience Timeline ─── */
.timeline { position: relative; padding-left: 2rem; }
.timeline::before {
  content: ''; position: absolute; left: 7px; top: 0; bottom: 0;
  width: 2px; background: var(--border);
}
.timeline-item { position: relative; margin-bottom: 2.5rem; padding-left: 1.5rem; }
.timeline-dot {
  position: absolute; left: -2rem; top: 6px; width: 16px; height: 16px;
  border-radius: 50%; background: var(--plum); border: 3px solid var(--bg);
  z-index: 1;
}
.timeline-content {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--card-radius);
  padding: 1.5rem; transition: all 0.3s;
}
.timeline-content:hover { box-shadow: var(--shadow); }
.timeline-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }
.timeline-role { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 600; flex: 1; }
.timeline-period { font-size: 0.8rem; font-weight: 600; color: var(--plum); white-space: nowrap; }
.timeline-points { margin-top: 0.75rem; padding-left: 1.25rem; }
.timeline-points li { font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.35rem; line-height: 1.6; }
.volunteer-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
.volunteer-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--card-radius);
  padding: 1.5rem; transition: all 0.3s;
}
.volunteer-card:hover { box-shadow: var(--shadow); }
.volunteer-card h4 { font-family: 'Playfair Display', serif; font-weight: 600; margin-bottom: 0.25rem; }
.volunteer-card p { font-size: 0.88rem; color: var(--text-secondary); }
.vol-period { font-size: 0.8rem; color: var(--plum); font-weight: 600; }

/* ─── Portfolio ─── */
.portfolio-section { background: var(--bg-alt); }
.filter-row { display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
.filter-btn {
  background: transparent; border: 1.5px solid var(--border); color: var(--text-secondary);
  padding: 0.45rem 1.1rem; border-radius: 20px; font-size: 0.82rem; cursor: pointer;
  font-family: 'Source Sans 3', sans-serif; font-weight: 500; transition: all 0.25s;
}
.filter-btn.active, .filter-btn:hover { background: var(--plum); color: #fff; border-color: var(--plum); }
.portfolio-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.portfolio-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--card-radius);
  overflow: hidden; cursor: pointer; transition: all 0.35s;
}
.portfolio-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
.pcard-img {
  height: 160px;
  background: linear-gradient(135deg, var(--rose-light, #E8D5D8) 0%, var(--bg-alt) 100%);
  position: relative; padding: 0.75rem;
}
.pcard-title { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; padding: 1rem 1rem 0.25rem; }

/* ─── Skills ─── */
.skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
.skill-bar-item { margin-bottom: 1.25rem; }
.skill-bar-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; }
.skill-icon { font-size: 1rem; }
.skill-name { flex: 1; font-size: 0.9rem; font-weight: 500; }
.skill-percent { font-size: 0.8rem; font-weight: 700; color: var(--plum); }
.skill-bar-track { height: 8px; background: var(--bg-alt); border-radius: 4px; overflow: hidden; }
.skill-bar-fill { height: 100%; background: linear-gradient(90deg, var(--plum), var(--plum-light)); border-radius: 4px; }
.wid-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.wid-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--card-radius);
  padding: 1.25rem; text-align: center; transition: all 0.3s;
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
}
.wid-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
.wid-icon { font-size: 1.75rem; }
.wid-title { font-size: 0.82rem; font-weight: 600; color: var(--text-secondary); }

/* ─── Contact ─── */
.contact-section { background: var(--bg-alt); }
.contact-intro { color: var(--text-secondary); max-width: 500px; margin-bottom: 2.5rem; }
.contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 3rem; }
.contact-item { display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.5rem; }
.ci-icon {
  width: 40px; height: 40px; border-radius: 50%; background: var(--plum);
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
}
.contact-item strong { font-size: 0.9rem; display: block; margin-bottom: 0.15rem; }
.contact-item p { font-size: 0.85rem; color: var(--text-secondary); }
.contact-form-wrap {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--card-radius); padding: 2rem;
  display: flex; flex-direction: column; gap: 1rem;
}
.form-input {
  width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--border);
  border-radius: 8px; font-family: 'Source Sans 3', sans-serif;
  font-size: 0.9rem; background: var(--bg); color: var(--text);
  transition: border 0.25s; outline: none;
}
.form-input:focus { border-color: var(--plum); }
.form-textarea { resize: vertical; }
.btn-submit {
  background: var(--plum); color: #fff; border: none; padding: 0.85rem 2rem;
  border-radius: 8px; font-weight: 700; font-size: 0.95rem; cursor: pointer;
  font-family: 'Source Sans 3', sans-serif;
  transition: all 0.3s; align-self: flex-end;
}
.btn-submit:hover { opacity: 0.9; transform: translateY(-2px); }
.btn-submit.sending { opacity: 0.7; cursor: wait; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* Form states */
.form-error {
  color: #D32F2F; font-size: 0.82rem; font-weight: 500;
  background: #FFF0F0; padding: 0.6rem 1rem; border-radius: 6px;
  border-left: 3px solid #D32F2F;
}
.form-success {
  text-align: center; padding: 2rem 1rem;
}
.success-icon {
  width: 56px; height: 56px; border-radius: 50%; background: #3D1F3E; color: #fff;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;
  font-size: 1.5rem; font-weight: 700;
  animation: scaleIn 0.4s cubic-bezier(0.16,1,0.3,1);
}
@keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
.success-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--text); margin-bottom: 0.5rem; }
.success-text { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.7; max-width: 340px; margin: 0 auto; }
.spinner {
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.6s linear infinite;
  vertical-align: middle; margin-right: 6px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.form-input:disabled { opacity: 0.6; cursor: not-allowed; }

/* ─── Footer ─── */
.footer {
  border-top: 1px solid var(--border); padding: 1.5rem 2rem;
  background: var(--bg);
}
.footer-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
}
.footer-brand strong { font-family: 'Playfair Display', serif; display: block; font-size: 0.95rem; }
.footer-brand span { font-size: 0.75rem; color: var(--text-muted); }
.footer-socials { display: flex; gap: 0.5rem; }
.footer-copy { font-size: 0.75rem; color: var(--text-muted); }

/* ─── Modal ─── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 2rem;
  animation: fadeIn 0.25s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-content {
  background: var(--bg-card); border-radius: 16px; max-width: 560px; width: 100%;
  padding: 2.5rem; position: relative;
  animation: slideUp 0.35s cubic-bezier(0.16,1,0.3,1);
}
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
.modal-close {
  position: absolute; top: 1rem; right: 1rem; background: none; border: none;
  font-size: 1.25rem; cursor: pointer; color: var(--text-muted); width: 36px; height: 36px;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  transition: all 0.25s;
}
.modal-close:hover { background: var(--bg-alt); color: var(--text); }
.modal-badge { display: inline-block; background: var(--plum); color: #fff; font-size: 0.7rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem; }
.modal-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; }
.modal-desc { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.5rem; }
.modal-details p { color: var(--text-secondary); font-size: 0.88rem; line-height: 1.8; }
.modal-meta { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); }
.modal-meta span { font-size: 0.8rem; color: var(--text-muted); }

/* ─── Mobile ─── */
@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr; gap: 2.5rem; text-align: center; }
  .hero-name { font-size: 2.8rem; }
  .hero-desc { max-width: 100%; margin: 0 auto; }
  .hero-actions { justify-content: center; }
  .hero-socials { justify-content: center; }
  .hero-img-placeholder { width: 280px; height: 340px; margin: 0 auto; }
  .hero-quote-card { left: 10px; bottom: -10px; max-width: 200px; }
  .featured-grid, .portfolio-grid { grid-template-columns: repeat(2, 1fr); }
  .about-grid { grid-template-columns: 1fr; }
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .skills-grid { grid-template-columns: 1fr; }
  .contact-grid { grid-template-columns: 1fr; }
  .edu-grid, .volunteer-grid { grid-template-columns: 1fr; }
  .section-heading { font-size: 2rem; }
}

@media (max-width: 640px) {
  .nav-links {
    display: none; position: fixed; top: 60px; left: 0; right: 0;
    background: var(--bg-card); border-bottom: 1px solid var(--border);
    flex-direction: column; padding: 1rem; gap: 0.25rem;
    box-shadow: var(--shadow);
  }
  .nav-links.open { display: flex; }
  .hamburger { display: flex; }
  .hero-name { font-size: 2.2rem; }
  .featured-grid, .portfolio-grid { grid-template-columns: 1fr; }
  .nav-inner { padding: 0.75rem 1rem; }
  .section { padding: 3rem 1rem; }
  .hero-section { padding: 6rem 1rem 3rem; }
  .wid-grid { grid-template-columns: repeat(2, 1fr); }
}
  `;
}
