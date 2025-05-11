import { Particles } from "@tsparticles/react";

export default function ParticlesBackground() {
  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: { enable: true, zIndex: 0 },
        background: { color: "#1A0B2E" },
        particles: {
          number: { value: 70, density: { enable: true, value_area: 900 } },
          color: { value: ["#fff", "#00D4FF", "#FF6A88", "#FF8E53", "#B266FF"] },
          shape: { type: "circle" },
          opacity: { value: 0.25, random: true },
          size: { value: 3.5, random: { enable: true, minimumValue: 1 } },
          move: { enable: true, speed: 1.2, direction: "none", outModes: "out" },
        },
        interactivity: {
          events: { onHover: { enable: true, mode: "repulse" } },
          modes: { repulse: { distance: 100, duration: 0.4 } },
        },
        detectRetina: true,
      }}
    />
  );
} 