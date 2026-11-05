import { useState } from "react";
import "./VehicleArchive.css";

import avni from "../assets/projects/avni_1.jpeg";
import ashwini from "../assets/projects/ashwini_1.jpeg";
import agni from "../assets/projects/agni.jpg";
import centaur from "../assets/projects/centaur_1.png";
import airawat from "../assets/projects/airawat.jpg";
import kurm from "../assets/projects/KURM.JPEG";

const VEHICLES = [
  {
    name: "AVNI",
    year: "CURRENT PLATFORM",
    image: avni,
    description:
      "Our latest flagship UGV rover engineered specifically for the Unmanned Ground Vehicle Challenge (UGVC). Avni features custom suspension kinematics, a decentralized ROS 2-based autonomy architecture, and a state-of-the-art sensory and computing payload.",
  },
  {
    name: "ASHWINI",
    year: "GROUND VEHICLE",
    image: ashwini,
    description:
      "A fully autonomous unmanned ground vehicle capable of navigation, obstacle avoidance, and real-world terrain traversal using sensor fusion.",
  },
  {
    name: "AGNI",
    year: "GROUND VEHICLE",
    image: agni,
    description:
      "AGNI became the foundation of our modern autonomy stack — a blend of intelligence, control, and design that paved the way for Ashwini.",
  },
  {
    name: "CENTAUR",
    year: "GROUND VEHICLE",
    image: centaur,
    description:
      "CENTAUR, our first autonomous rover, marked UGV-DTU’s beginning — a bold step into the world of self-driving robotics and mechanical innovation.",
  },
  {
    name: "AIRAWAT",
    year: "GROUND VEHICLE",
    image: airawat,
    description:
      "AIRAWAT followed, introducing advanced vision and localization, turning stability and reliability into our new engineering standards.",
  },
  {
    name: "KURM",
    year: "GROUND VEHICLE",
    image: kurm,
    description:
      "KURM carried forward the legacy, refining path planning, perception, and RTK-GPS precision to conquer complex terrains with confidence.",
  },
];

export default function VehicleArchive() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeVehicle = VEHICLES[activeIndex];

  const select = (index) => {
    setActiveIndex((index + VEHICLES.length) % VEHICLES.length);
  };

  return (
    <section className="vehicle-archive" aria-labelledby="vehicle-archive-title">
      <div className="vehicle-archive-inner">
        <div className="vehicle-archive-heading">
          <span className="archive-kicker">UGV-DTU / PLATFORM ARCHIVE</span>
          <h2 id="vehicle-archive-title">Built to move beyond.</h2>
          <p>
            Explore the ground-vehicle platforms documented by the team. Select
            a platform to view its existing project overview.
          </p>
        </div>

        <div className="vehicle-archive-layout">
          <div className="vehicle-archive-visual">
            <div className="archive-image-frame">
              <img key={activeVehicle.name} src={activeVehicle.image} alt={activeVehicle.name} />
              <span className="archive-image-index">
                {String(activeIndex + 1).padStart(2, "0")} / {String(VEHICLES.length).padStart(2, "0")}
              </span>
            </div>
            <div className="archive-controls">
              <button type="button" onClick={() => select(activeIndex - 1)} aria-label="Previous vehicle">←</button>
              <button type="button" onClick={() => select(activeIndex + 1)} aria-label="Next vehicle">→</button>
            </div>
          </div>

          <div className="vehicle-archive-details" aria-live="polite">
            <span className="archive-kicker">{activeVehicle.year}</span>
            <h3>{activeVehicle.name}</h3>
            <p>{activeVehicle.description}</p>
            <div className="archive-selector" role="group" aria-label="Select a vehicle">
              {VEHICLES.map((vehicle, index) => (
                <button
                  type="button"
                  key={vehicle.name}
                  className={index === activeIndex ? "active" : ""}
                  onClick={() => select(index)}
                  aria-pressed={index === activeIndex}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {vehicle.name}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
