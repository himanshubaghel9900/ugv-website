import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const MENU_ALL = [
  { label: "Home", id: "home", path: "/" },
  { label: "UGVC", path: "/ugvc" },
  { label: "ISDC", path: "/isdc" },
  { label: "IGVC", path: "/igvc" },
  { label: "Blogs", path: "/blogs" },
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Research", id: "research" },
  { label: "Sponsors", id: "sponsors" },
  { label: "Team", id: "team" },
  { label: "Visuals", id: "visuals" },
  { label: "Contact", id: "contact" },
];

const MENU_PRIMARY = MENU_ALL.slice(0, 5);

let raf = null;

const smoothScrollTo = (targetY, onDone) => {
  cancelAnimationFrame(raf);

  const startY = window.scrollY;
  const diff = targetY - startY;
  const distance = Math.abs(diff);
  const duration = Math.min(4200, Math.max(1600, distance * 1.15));
  let start = null;

  const ease = (t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

  const step = (time) => {
    if (!start) start = time;
    const p = Math.min((time - start) / duration, 1);
    window.scrollTo(0, startY + diff * ease(p));
    if (p < 1) raf = requestAnimationFrame(step);
    else onDone?.();
  };

  raf = requestAnimationFrame(step);
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mode, setMode] = useState("desktop");
  const [theme, setTheme] = useState("dark");

  const isHome = location.pathname === "/";
  const clickLock = useRef(false);
  const scrollLock = useRef(false);

  useEffect(() => {
    let savedTheme = "dark";
    try {
      savedTheme = window.localStorage.getItem("ugv-theme") === "light" ? "light" : "dark";
    } catch {
      // Storage can be unavailable in private browsing; dark remains the default.
    }
    document.documentElement.setAttribute("data-theme", savedTheme);
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        window.localStorage.setItem("ugv-theme", next);
      } catch {
        // The theme still changes for this session if storage is unavailable.
      }
      return next;
    });
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 1);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const m = window.matchMedia("(max-width: 767px)");
    const t = window.matchMedia("(max-width: 1360px)");
    const updateMode = () =>
      setMode(m.matches ? "mobile" : t.matches ? "tablet" : "desktop");
    updateMode();
    m.addEventListener("change", updateMode);
    t.addEventListener("change", updateMode);
    return () => {
      m.removeEventListener("change", updateMode);
      t.removeEventListener("change", updateMode);
    };
  }, []);

  const currentMenu = mode === "desktop" ? MENU_ALL : MENU_PRIMARY;

  const getDisplayActiveIndex = () => {
    const activeItem = MENU_ALL[activeIndex];
    if (!activeItem) return 0;
    const idx = currentMenu.findIndex((item) => item.label === activeItem.label);
    if (idx !== -1) return idx;
    if (activeItem.id) {
      const homeIdx = currentMenu.findIndex((item) => item.id === "home" || item.path === "/");
      if (homeIdx !== -1) return homeIdx;
    }
    return 0;
  };

  useEffect(() => {
    if (isHome) return;
    const idx = MENU_ALL.findIndex(
      (item) =>
        item.path &&
        (location.pathname === item.path || location.pathname.startsWith(item.path + "/"))
    );
    if (idx !== -1) setActiveIndex(idx);
  }, [location.pathname, isHome]);

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollLock.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = MENU_ALL.findIndex((item) => item.id === entry.target.id);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    MENU_ALL.forEach((item) => {
      if (!item.id) return;
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [isHome]);

  const handleClick = (item, index) => {
    if (clickLock.current) return;
    clickLock.current = true;
    scrollLock.current = true;
    setActiveIndex(index);
    setMenuOpen(false);

    const unlock = () => {
      scrollLock.current = false;
      clickLock.current = false;
    };

    if (item.label === "Home") {
      navigate("/");
      requestAnimationFrame(() => smoothScrollTo(0, unlock));
      return;
    }

    if (item.id) {
      navigate("/");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const element = document.getElementById(item.id);
          if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY;
            smoothScrollTo(y, unlock);
          } else {
            unlock();
          }
        });
      });
      return;
    }

    if (item.path) {
      navigate(item.path);
      unlock();
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div
        className="nav-logo"
        role="button"
        tabIndex={0}
        onClick={() => handleClick(MENU_ALL[0], 0)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleClick(MENU_ALL[0], 0);
          }
        }}
      >
        UGV-<span>DTU</span>
      </div>

      {(mode === "desktop" || mode === "tablet") && (
        <ul className="nav-links">
          <span
            className="pill-indicator"
            style={{
              transform: `translateX(${getDisplayActiveIndex() * 102}px)`,
              transition: "transform 0.6s cubic-bezier(.22,1,.36,1)",
            }}
          />
          {currentMenu.map((item, index) => (
            <li
              key={item.label}
              className="nav-pill"
              role="button"
              tabIndex={0}
              onClick={() => handleClick(item, index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleClick(item, index);
                }
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        aria-pressed={theme === "light"}
        title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      >
        <span aria-hidden="true">{theme === "dark" ? "☼" : "◐"}</span>
      </button>

      {mode === "mobile" && (
        <button
          type="button"
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      )}

      {mode === "mobile" && menuOpen && (
        <div className="mobile-menu">
          {MENU_PRIMARY.map((item, index) => (
            <div
              key={item.label}
              className="mobile-item"
              role="button"
              tabIndex={0}
              onClick={() => handleClick(item, index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleClick(item, index);
                }
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
