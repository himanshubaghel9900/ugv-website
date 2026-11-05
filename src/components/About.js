import { useEffect, useRef, useState } from "react";
import "./About.css";

const ACHIEVEMENTS = [
  { competition: "UGVC, ICMTC'26", position: "10th Global Rank" },
  { competition: "ISDC'26, (SPROS)", position: "Top 10 Global Rank" },
  { competition: "RoboSoc, Invictus’26", position: "3rd Runner Up" },
  { competition: "Autonav Challenge, IGVC'25", position: "Top 15 Global Rank" },
  { competition: "UGVC, ICMTC'24", position: "3rd Runner Up" },
  { competition: "UGVC Presentation, ICMTC'24", position: "1st Position" },
  { competition: "Cyber Challenge, IGVC'23", position: "2nd Runner Up" },
  { competition: "Design Challenge, IGVC'23", position: "2nd Runner Up" },
  { competition: "Techfest'23 (IIT Bombay) – Mernifier", position: "1st Runner Up" },
  { competition: "Techfest'23 (IIT Bombay) – TIH-IoT", position: "1st Runner Up" },
  { competition: "MATLAB MiniDrone Competition", position: "Top 8 Global Rank" },
  { competition: "Techfest MicroMouse Competition", position: "3rd Runner Up" },
  { competition: "Line Following Competition", position: "1st Runner Up" },
  { competition: "Flipkart Grid", position: "University Finalist" },
  { competition: "Smart India Hackathon", position: "University Finalist" },
  { competition: "Sustainable Vehicle Design – Autodesk", position: "Runners Up" },
];

function About() {
  const [active, setActive] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [achievementFilter, setAchievementFilter] = useState("all");
  const ref = useRef(null);

  const filteredAchievements = ACHIEVEMENTS.filter((achievement) => {
    if (achievementFilter === "global") return /Global/i.test(achievement.position);
    if (achievementFilter === "finalist") return /Finalist/i.test(achievement.position);
    if (achievementFilter === "podium") return !/Global|Finalist/i.test(achievement.position);
    return true;
  });
  const displayedAchievements = showAll ? filteredAchievements : filteredAchievements.slice(0, 10);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className={`about ${active ? "reveal" : ""}`}>
      <div className="about-viewport">
        <div className="about-glass">
          <h2 className="about-title">About Us</h2>

          <p className="about-intro">
            UGV-DTU is a team of undergraduate students at Delhi Technological University working on autonomous ground vehicle technology. The team was formed with a clear national goal: to build a 'Made in India' solution for complete vehicular autonomy that is specifically designed for Indian road conditions.
          </p>
          <p className="about-details">
            Unlike most self-driving vehicle research which is targeted at structured western road environments, UGV-DTU focuses on the unique challenges of Indian roads: unstructured traffic, poor lane discipline, unpredictable obstacles, and varied terrain. The team works across mechanical engineering, electronics, computer vision, and robotics software to build fully integrated autonomous platforms from scratch.
          </p>
          <p className="about-details">
            The team designs, builds, and validates unmanned ground vehicles end-to-end. On the hardware side, this includes custom chassis fabrication, suspension systems, drivetrain assembly, and integration of sensors such as LiDAR, stereo cameras, IMU, and GPS/RTK modules. On the software side, the team develops a full ROS 2-based autonomous navigation stack featuring SLAM for real-time mapping, Nav2 for path planning, EKF for sensor fusion, and custom computer vision pipelines for lane detection and obstacle recognition.
          </p>

          <div className="about-cards">
            <div className="about-card">
              <h3>Autonomy</h3>
              <p>
                Perception, localization, planning, and control systems enabling
                intelligent navigation.
              </p>
            </div>

            <div className="about-card">
              <h3>Robotics Systems</h3>
              <p>
                Mechanical design, electronics, embedded systems, and integration
                of complex robotics platforms.
              </p>
            </div>

            <div className="about-card">
              <h3>Research</h3>
              <p>
                Focused on SLAM, AI-based perception, and robust autonomy through
                experimentation.
              </p>
            </div>
          </div>

          <div className="about-achievements">
            <h3 className="about-subtitle">Achievements</h3>
            <div className="achievement-filters" role="group" aria-label="Filter achievements">
              {[
                ["all", "All"],
                ["global", "Global ranks"],
                ["podium", "Podium finishes"],
                ["finalist", "Finalists"],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={achievementFilter === value ? "active" : ""}
                  aria-pressed={achievementFilter === value}
                  onClick={() => { setAchievementFilter(value); setShowAll(false); }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="table-container">
              <table className="achievements-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Competition</th>
                    <th>Position / Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedAchievements.map((ach, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td className="comp-name">{ach.competition}</td>
                      <td className="comp-pos">
                        <span className="badge">{ach.position}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredAchievements.length > 10 && (
              <div className="achievements-toggle-container">
                <button
                  className="achievements-toggle-btn"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </div>

          <div className="about-map-section">
            <div className="about-map-info">
              <div className="location-details">
                <span className="location-label">LAB ADDRESS</span>
                <p className="location-address">
                  <strong>UGV-DTU</strong><br />
                  WT-3 and 4, Wind Tunnel,<br />
                  Delhi Technological University,<br />
                  Shahbad Daulatpur, Rohini, Delhi - 110042
                </p>
              </div>
            </div>
            <div className="about-map-container">
              <iframe
                title="UGV DTU Lab Location"
                src="https://maps.google.com/maps?q=28.750860325600357,77.11496567550515&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;