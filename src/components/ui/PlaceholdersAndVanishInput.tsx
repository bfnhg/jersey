// src/components/ui/PlaceholdersAndVanishInput.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
}: {
  placeholders: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (query: string) => void;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);
  const newDataRef = useRef<any[]>([]);

  // Rotation des placeholders
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [placeholders]);

  const draw = useCallback(() => {
    if (!inputRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const computedStyles = getComputedStyle(inputRef.current);
    const fontSize = parseFloat(computedStyles.fontSize);
    ctx.font = `${fontSize * 1.8}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#fff";
    ctx.fillText(value, 16, 36);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const particles: any[] = [];

    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 4) {
        const i = (y * canvas.width + x) * 4;
        if (imageData.data[i + 3] > 128) {
          particles.push({ x, y });
        }
      }
    }

    newDataRef.current = particles.map(p => ({
      x: p.x / 2,
      y: p.y / 2,
      r: 1.5,
    }));
  }, [value]);

  const animate = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const animateFrame = () => {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      newDataRef.current = newDataRef.current.filter(p => p.r > 0.1);
      newDataRef.current.forEach(p => {
        p.x += (Math.random() - 0.5) * 4;
        p.y += (Math.random() - 0.5) * 4;
        p.r *= 0.96;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 197, 94, 0.8)";
        ctx.fill();
      });

      if (newDataRef.current.length > 0) {
        requestAnimationFrame(animateFrame);
      } else {
        setAnimating(false);
        setValue("");
      }
    };
    animateFrame();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || animating) return;

    setAnimating(true);
    draw();
    setTimeout(() => {
      animate();
      onSubmit?.(value);
    }, 100);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center w-64 sm:w-80">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onChange?.(e);
          }}
          className={cn(
            "w-full h-12 bg-white/10 backdrop-blur-md rounded-full pl-12 pr-12 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-400 transition",
            animating && "text-transparent"
          )}
          placeholder="Rechercher..."
        />

        {/* Icône Loupe */}
        <button
          type="submit"
          className="absolute left-4 text-green-400 hover:text-green-300 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Canvas pour l'effet particules */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{ opacity: animating ? 1 : 0, transition: "opacity 0.3s" }}
        />

        {/* Placeholder animé */}
        <AnimatePresence mode="wait">
          {!value && !animating && (
            <motion.p
              key={currentPlaceholder}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 0.5 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute left-12 text-white/50 pointer-events-none text-sm sm:text-base"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}