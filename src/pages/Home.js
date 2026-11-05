import { useEffect, useRef, useState } from "react";
import "./Home.css";
import About from "../components/About.js";
import Projects from "../components/Projects.js";
import Research from "../components/Research.js";
import Sponsors from "../components/Sponsors.js";
import Team from "../components/Team.js";
import Visuals from "../components/Visuals.js";
import Contact from "../components/Contact.js";
import UgvRobot from "../components/UgvRobot.js";
import VehicleArchive from "../components/VehicleArchive.js";

import agniImg from "../assets/projects/agni.jpg";
import ashwini_1_Img from "../assets/projects/ashwini_1.jpeg";
// import ashwini_2_Img from "../assets/projects/ashwini_2.jpeg";
import centaur_1_Img from "../assets/projects/centaur_1.png";
// import centaur_2_Img from "../assets/projects/centaur_2.png";
import kurmImg from "../assets/projects/KURM.JPEG";
import valkyrie_2Img from "../assets/projects/valkyrie_2.jpg";




const sentences = [
  "Building autonomous ground vehicles.",
  "Researching perception and navigation.",
  "Engineering real-world robotics systems.",
  "UGV Tech Team of DTU.",
];

const images = [
  ashwini_1_Img,
  valkyrie_2Img,
  agniImg,
  kurmImg,
  centaur_1_Img,
];

const smoothScrollTo = (targetY, duration = 1000) => {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let startTime = null;

  const easeInOut = (t) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const time = timestamp - startTime;
    const progress = Math.min(time / duration, 1);
    const eased = easeInOut(progress);
    window.scrollTo(0, startY + diff * eased);
    if (time < duration) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

function Home() {
  const [text, setText] = useState("");
  const [sIndex, setSIndex] = useState(0);
  const [cIndex, setCIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const [activeImg, setActiveImg] = useState(0);
  const [visible, setVisible] = useState(false);
  const landingRef = useRef(null);

  useEffect(() => {
    const current = sentences[sIndex];
    let t;

    if (!deleting && cIndex < current.length) {
      t = setTimeout(() => {
        setText(current.slice(0, cIndex + 1));
        setCIndex(cIndex + 1);
      }, 55);
    } else if (deleting && cIndex > 0) {
      t = setTimeout(() => {
        setText(current.slice(0, cIndex - 1));
        setCIndex(cIndex - 1);
      }, 35);
    } else if (!deleting && cIndex === current.length) {
      t = setTimeout(() => setDeleting(true), 1200);
    } else {
      setDeleting(false);
      setSIndex((sIndex + 1) % sentences.length);
    }

    return () => clearTimeout(t);
  }, [cIndex, deleting, sIndex]);

  useEffect(() => {
    const id = setInterval(
      () => setActiveImg((p) => (p + 1) % images.length),
      6500
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.4 }
    );
    if (landingRef.current) observer.observe(landingRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(y, 1000);
  };

  return (
    <>
      <section
        id="home"
        ref={landingRef}
        className={`home-landing ${visible ? "show" : "hide"}`}
      >
        <div className="landing-left">

          <UgvRobot/>

          <h1 className="landing-title">
            Unmanned Ground Vehicle <span>DTU</span>
          </h1>

          <p className="landing-type">
            {text}
            <span className="cursor">|</span>
          </p>

          <p className="landing-desc">
            We are a multidisciplinary student team focused on designing,
            building, and deploying unmanned ground vehicles for real-world
            applications.
          </p>

          <div className="landing-actions">
            <button
              className="landing-btn primary"
              onClick={() => scrollToSection("projects")}
            >
              Explore Projects
            </button>

            <button
              className="landing-btn secondary"
              onClick={() => scrollToSection("contact")}
            >
              Contact Us
            </button>
          </div>
        </div>

        <div className="landing-right">
          <div className="slideshow">
            {images.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt="UGV project"
                className={`slide ${idx === activeImg ? "active" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      <VehicleArchive />
      <About />
      <Projects />
      <Research />
      <Sponsors />
      <Team />
      <Visuals />
      <Contact />
    </>
  );
}

export default Home;