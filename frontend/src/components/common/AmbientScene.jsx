// ==============================================
// Ambient Scene Component
// Poori screen me slowly drift karti hui unique,
// tool-related 3D floating icon orbs. Cursor paas
// aane par orb door bhaag jaata hai (repel effect).
// App.jsx me ek hi baar globally mount hota hai.
// ==============================================

import React, { useEffect, useRef } from "react";
import { AudioWaveform, Captions, Play, Sparkles, Languages, Mic2 } from "lucide-react";

// Har orb apna unique icon, position, size, gradient aur speed rakhta hai
const ORB_CONFIGS = [
  { Icon: AudioWaveform, top: "14%", left: "8%", size: 60, gradient: "from-primary-400 to-primary-600", duration: "9s" },
  { Icon: Captions, top: "24%", left: "85%", size: 54, gradient: "from-accent-300 to-accent-500", duration: "11s" },
  { Icon: Play, top: "68%", left: "10%", size: 58, gradient: "from-primary-300 to-primary-500", duration: "8s" },
  { Icon: Sparkles, top: "80%", left: "80%", size: 50, gradient: "from-accent-400 to-accent-600", duration: "10s" },
  { Icon: Languages, top: "45%", left: "94%", size: 46, gradient: "from-primary-400 to-accent-400", duration: "12s" },
  { Icon: Mic2, top: "38%", left: "3%", size: 48, gradient: "from-accent-300 to-primary-400", duration: "9.5s" },
];

const REPEL_RADIUS = 170; // px - itni door se orb reaction dena start karega
const REPEL_STRENGTH = 55; // px - max kitna door bhaagega

const AmbientScene = () => {
  const orbRefs = useRef([]);
  const frameRef = useRef(null);

  useEffect(() => {
    const handleMove = (e) => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        orbRefs.current.forEach((el) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = cx - e.clientX;
          const dy = cy - e.clientY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < REPEL_RADIUS) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
            const angle = Math.atan2(dy, dx);
            el.style.transform = `translate(${Math.cos(angle) * force}px, ${Math.sin(angle) * force}px) scale(1.1)`;
          } else {
            el.style.transform = "translate(0, 0) scale(1)";
          }
        });
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
      {/* Soft ambient background glow orbs */}
      <div className="orb w-96 h-96 bg-primary-200 -top-10 -left-16 animate-float" />
      <div className="orb w-80 h-80 bg-accent-200 bottom-[-10%] right-[-5%] animate-float-delayed" />
      <div className="orb w-72 h-72 bg-primary-100 top-1/3 right-1/4 animate-float" />

      {/* Unique tool-themed 3D floating icon badges */}
      {ORB_CONFIGS.map(({ Icon, top, left, size, gradient, duration }, idx) => (
        <div
          key={idx}
          className="absolute"
          style={{ top, left, animation: `driftPath ${duration} ease-in-out infinite` }}
        >
          <div
            ref={(el) => (orbRefs.current[idx] = el)}
            className="transition-transform duration-300 ease-out"
            style={{ width: size, height: size }}
          >
            <div
              className={`w-full h-full rounded-2xl bg-gradient-to-br ${gradient} shadow-glow flex items-center justify-center opacity-70`}
            >
              <Icon className="text-white" style={{ width: size * 0.45, height: size * 0.45 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AmbientScene;
