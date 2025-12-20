"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../..//lib/utils";

type Props = {
  placeholders: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (query: string) => void;
  theme?: "dark" | "light";
  className?: string;
};

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
  theme = "dark",
  className,
}: Props) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);
  const newDataRef = useRef<any[]>([]);

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
    ctx.fillStyle = theme === "light" ? "#000" : "#fff";
    ctx.textBaseline = "middle";
    ctx.fillText(value, 16, canvas.height / 4);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const particles: any[] = [];

    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 4) {
        const index = (y * canvas.width + x) * 4;
        if (imageData.data[index + 3] > 128) {
          particles.push({ x: x / 2, y: y / 2 });
        }
      }
    }

    newDataRef.current = particles.map(() => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
    }));
  }, [value, theme]);

  const animate = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animateFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      newDataRef.current = newDataRef.current.filter((p) => p.r > 0.2);

      newDataRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
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
        setValue(""); // Vide après animation
        onChange?.({ target: { value: "" } } as any);
      }
    };

    animateFrame();
  }, [onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || animating) return;

    setAnimating(true);
    draw();
    setTimeout(() => animate(), 100);
    onSubmit?.(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(e);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative flex max-w-sm items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          className={cn(
            "w-full h-11 rounded-full pl-12 pr-4 text-base outline-none transition-all",
            theme === "dark"
              ? "bg-white/10 backdrop-blur-md text-white placeholder-transparent"
              : "bg-white/80 text-black",
            animating && "text-transparent"
          )}
          placeholder={placeholders[0]}
        />

        {/* Icône de recherche */}
        <button
          type="submit"
          disabled={animating}
          className={cn(
            "absolute left-4 transition-colors",
            theme === "dark" ? "text-green-400 hover:text-green-300" : "text-gray-600"
          )}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Canvas particules */}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.5, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className={cn(
                "absolute left-12 pointer-events-none text-base",
                theme === "dark" ? "text-white/50" : "text-black/50"
              )}
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}