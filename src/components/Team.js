import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import "./Team.css";
import {COUNCIL, DEPARTMENTS } from "../utils/teamData.js"

gsap.registerPlugin(ScrollTrigger);

function Team() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".team-card").forEach((card) => {
        const img = card.querySelector(".team-img");
        const text = card.querySelector(".team-info");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        tl.from(card, {
          opacity: 0,
          y: 60,
          duration: 0.65,
          ease: "power2.out",
          clearProps: "transform",
        })
          .from(
            img,
            {
              opacity: 0,
              y: 20,
              duration: 0.4,
              ease: "power2.out",
            },
            "-=0.3"
          )
          .from(
            text.children,
            {
              opacity: 0,
              y: 20,
              stagger: 0.08,
              duration: 0.4,
              ease: "power2.out",
            },
            "-=0.25"
          );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderCards = (list) =>
    list.map((m) => (
      <div
        className="team-card"
        key={m.name}
        onPointerMove={(event) => {
          if (event.pointerType === "touch") return;
          const bounds = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          event.currentTarget.style.setProperty("--tilt-x", `${-y * 5}deg`);
          event.currentTarget.style.setProperty("--tilt-y", `${x * 5}deg`);
        }}
        onPointerLeave={(event) => {
          event.currentTarget.style.setProperty("--tilt-x", "0deg");
          event.currentTarget.style.setProperty("--tilt-y", "0deg");
        }}
      >
        <div className="team-img">
          <img src={m.image} alt={m.name} />
        </div>

        <div className="team-info">
          <h3>{m.name}</h3>
          <p>{m.role}</p>

          <div className="team-socials">
            {m.github && m.github !== "#" && (
              <a href={m.github} target="_blank" rel="noreferrer" aria-label={`${m.name} GitHub`}>
                <FaGithub />
              </a>
            )}
            {m.linkedin && m.linkedin !== "#" && (
              <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label={`${m.name} LinkedIn`}>
                <FaLinkedinIn />
              </a>
            )}
            {m.instagram && m.instagram !== "#" && (
              <a href={m.instagram} target="_blank" rel="noreferrer" aria-label={`${m.name} Instagram`}>
                <FaInstagram />
              </a>
            )}
          </div>
        </div>
      </div>
    ));

  return (
    <section id="team" className="team" ref={sectionRef}>
      <div className="team-glass-bg" />

      <div className="team-container">
        <div className="team-council-block">
            <h2 className="team-section-title ">Team Council</h2>
            <div className="team-grid">{renderCards(COUNCIL)}</div>
        </div>

        {Object.entries(DEPARTMENTS).filter(([, members]) => members.length > 0).map(([dept, members]) => (
          <div key={dept} className="team-department">
            <h3 className="team-section-title">{dept} Team</h3>
            <div className="team-grid">{renderCards(members)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Team;