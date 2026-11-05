import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import "./Visuals.css";

import img1 from "../assets/visuals/1.jpg";
import img2 from "../assets/visuals/2.jpg";
import img3 from "../assets/visuals/3.JPG";
import img4 from "../assets/visuals/4.jpg";
import img5 from "../assets/visuals/5.jpg";
import img6 from "../assets/visuals/6.jpeg";
import img7 from "../assets/visuals/7.jpeg";
import img8 from "../assets/visuals/8.jpg";
import img9 from "../assets/visuals/9.jpeg";
import img10 from "../assets/visuals/10.jpeg";
import img11 from "../assets/visuals/11.jpeg";
import img12 from "../assets/visuals/12.jpeg";
import avniImg from "../assets/projects/avni_1.jpeg";

const IMAGES = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  avniImg,
];

const LOOP = [...IMAGES, ...IMAGES];

function Visuals() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const x = useMotionValue(0);
  const isDragging = useRef(false);
  const lastPointerX = useRef(0);
  const velocity = useRef(0);

  const AUTO_SPEED = 35;
  const FRICTION = 0.94;
  const MIN_VELOCITY = 0.1;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.35 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (!trackRef.current || !visible) return;

    const width = trackRef.current.scrollWidth / 2;
    let currentX = x.get();

    if (isDragging.current) {
      currentX += velocity.current;
    } else if (Math.abs(velocity.current) > MIN_VELOCITY) {
      currentX += velocity.current;
      velocity.current *= FRICTION;
    } else {
      currentX -= (AUTO_SPEED * delta) / 1000;
    }

    if (currentX <= -width) currentX += width;
    if (currentX >= 0) currentX -= width;

    x.set(currentX);
  });

  const onPointerDown = (e) => {
    isDragging.current = true;
    lastPointerX.current = e.clientX;
    velocity.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPointerX.current;
    lastPointerX.current = e.clientX;
    velocity.current = dx;
    x.set(x.get() + dx);
  };

  const onPointerUp = (e) => {
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <section
      id="visuals"
      ref={sectionRef}
      className={`visuals ${visible ? "reveal" : ""}`}
    >
      <div className="visuals-glass-bg" />

      <div className="visuals-container">
        <div className="visuals-header">
          <h2 className="visuals-title">
            Visuals
            <span className="visuals-underline" />
          </h2>
          <p className="visuals-sub">
            Engineering moments, captured in motion
          </p>
        </div>
        
        <motion.div
          ref={trackRef}
          className="visuals-strip"
          style={{ x }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {LOOP.map((src, i) => (
            <motion.div
              key={i}
              className="visual-card"
              whileHover={{ scale: 1.08, y: -10 }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 18,
              }}
            >
              <img src={src} alt="UGV Visual" draggable={false} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Visuals;