"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

interface PixelatedCanvasProps {
  src?: string;
  width?: number;
  height?: number;
  cellSize?: number;
  dotScale?: number;
  shape?: "circle" | "square";
  backgroundColor?: string;
  grayscale?: boolean;
  className?: string;
  responsive?: boolean;
  interactive?: boolean;
  distortionStrength?: number;
  distortionRadius?: number;
  distortionMode?: "repel" | "attract" | "swirl";
  followSpeed?: number;
  maxFps?: number;
  jitterStrength?: number;
  fadeOnLeave?: boolean;
}

export function PixelatedCanvas({
  src,
  width = 400,
  height = 500,
  cellSize = 8,
  dotScale = 0.9,
  shape = "square",
  backgroundColor = "#000000",
  grayscale = false,
  className,
  responsive = false,
  interactive = true,
  distortionStrength = 3,
  distortionRadius = 150,
  distortionMode = "swirl",
  followSpeed = 0.15,
  maxFps = 60,
  jitterStrength = 2,
  fadeOnLeave = true,
}: PixelatedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const targetPointerRef = useRef({ x: -1000, y: -1000 });
  const lastFrameTimeRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width, height });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (responsive) {
      const handleResize = () => {
        setDimensions({ width, height });
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [responsive, width, height]);

  useEffect(() => {
    if (src) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imageRef.current = img;
        setImageLoaded(true);
      };
      img.src = src;
    } else {
      setImageLoaded(true);
    }
  }, [src]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const cols = Math.ceil(dimensions.width / cellSize);
    const rows = Math.ceil(dimensions.height / cellSize);

    const pixels: Array<{
      x: number;
      y: number;
      color: string;
      originalX: number;
      originalY: number;
    }> = [];

    // Pre-process image data once if image exists
    let imageDataCache: ImageData | null = null;
    let imageDrawParams: {
      drawX: number;
      drawY: number;
      drawWidth: number;
      drawHeight: number;
      imgWidth: number;
      imgHeight: number;
    } | null = null;

    if (imageRef.current) {
      const img = imageRef.current;
      const imgAspect = img.width / img.height;
      const canvasAspect = dimensions.width / dimensions.height;

      let drawWidth = dimensions.width;
      let drawHeight = dimensions.height;
      let drawX = 0;
      let drawY = 0;

      if (imgAspect > canvasAspect) {
        drawHeight = dimensions.height;
        drawWidth = drawHeight * imgAspect;
        drawX = (dimensions.width - drawWidth) / 2;
      } else {
        drawWidth = dimensions.width;
        drawHeight = drawWidth / imgAspect;
        drawY = (dimensions.height - drawHeight) / 2;
      }

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        tempCtx.drawImage(img, 0, 0);
        imageDataCache = tempCtx.getImageData(0, 0, img.width, img.height);
        imageDrawParams = {
          drawX,
          drawY,
          drawWidth,
          drawHeight,
          imgWidth: img.width,
          imgHeight: img.height,
        };
      }
    }

    // Initialize pixels
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * cellSize;
        const y = row * cellSize;
        let color = backgroundColor;

        if (imageDataCache && imageDrawParams) {
          const { drawX, drawY, drawWidth, drawHeight, imgWidth, imgHeight } = imageDrawParams;
          const sampleX = drawX + (x / dimensions.width) * drawWidth;
          const sampleY = drawY + (y / dimensions.height) * drawHeight;

          if (
            sampleX >= drawX &&
            sampleX < drawX + drawWidth &&
            sampleY >= drawY &&
            sampleY < drawY + drawHeight
          ) {
            const imgX = Math.floor(((sampleX - drawX) / drawWidth) * imgWidth);
            const imgY = Math.floor(((sampleY - drawY) / drawHeight) * imgHeight);
            const index = (imgY * imgWidth + imgX) * 4;
            const r = imageDataCache.data[index];
            const g = imageDataCache.data[index + 1];
            const b = imageDataCache.data[index + 2];

            if (grayscale) {
              const gray = r * 0.299 + g * 0.587 + b * 0.114;
              color = `rgb(${Math.round(gray)}, ${Math.round(gray)}, ${Math.round(gray)})`;
            } else {
              color = `rgb(${r}, ${g}, ${b})`;
            }
          }
        } else {
          // Create gradient pattern if no image
          const centerX = cols / 2;
          const centerY = rows / 2;
          const distance = Math.sqrt(
            Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2)
          );
          const maxDistance = Math.sqrt(
            Math.pow(centerX, 2) + Math.pow(centerY, 2)
          );
          const normalizedDistance = distance / maxDistance;

          if (normalizedDistance < 0.3) {
            color = "rgba(193, 39, 45, 0.8)"; // Red
          } else if (normalizedDistance < 0.6) {
            color = "rgba(255, 255, 255, 0.6)"; // White
          } else {
            color = "rgba(0, 98, 65, 0.8)"; // Green
          }
        }

        pixels.push({
          x,
          y,
          color,
          originalX: x,
          originalY: y,
        });
      }
    }

    let animationId: number;

    const draw = (timestamp: number) => {
      const deltaTime = timestamp - lastFrameTimeRef.current;
      const minFrameTime = 1000 / maxFps;

      if (deltaTime < minFrameTime) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      lastFrameTimeRef.current = timestamp;

      // Smooth pointer follow
      pointerRef.current.x +=
        (targetPointerRef.current.x - pointerRef.current.x) * followSpeed;
      pointerRef.current.y +=
        (targetPointerRef.current.y - pointerRef.current.y) * followSpeed;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      pixels.forEach((pixel) => {
        let drawX = pixel.originalX;
        let drawY = pixel.originalY;

        if (interactive) {
          const dx = pixel.originalX - pointerRef.current.x;
          const dy = pixel.originalY - pointerRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < distortionRadius) {
            const influence = 1 - distance / distortionRadius;
            let offsetX = 0;
            let offsetY = 0;

            if (distortionMode === "swirl") {
              const angle =
                Math.atan2(dy, dx) + influence * Math.PI * 2 * 0.5;
              offsetX = Math.cos(angle) * distortionStrength * influence;
              offsetY = Math.sin(angle) * distortionStrength * influence;
            } else if (distortionMode === "repel") {
              const angle = Math.atan2(dy, dx);
              offsetX = Math.cos(angle) * distortionStrength * influence;
              offsetY = Math.sin(angle) * distortionStrength * influence;
            } else if (distortionMode === "attract") {
              const angle = Math.atan2(-dy, -dx);
              offsetX = Math.cos(angle) * distortionStrength * influence;
              offsetY = Math.sin(angle) * distortionStrength * influence;
            }

            // Jitter
            offsetX +=
              (Math.random() - 0.5) * jitterStrength * influence * 0.1;
            offsetY +=
              (Math.random() - 0.5) * jitterStrength * influence * 0.1;

            drawX += offsetX;
            drawY += offsetY;
          }
        }

        ctx.fillStyle = pixel.color;
        const dotSize = cellSize * dotScale;
        const offset = (cellSize - dotSize) / 2;

        if (shape === "circle") {
          ctx.beginPath();
          ctx.arc(
            drawX + cellSize / 2,
            drawY + cellSize / 2,
            dotSize / 2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        } else {
          ctx.fillRect(drawX + offset, drawY + offset, dotSize, dotSize);
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [
    dimensions,
    cellSize,
    dotScale,
    shape,
    backgroundColor,
    grayscale,
    interactive,
    distortionStrength,
    distortionRadius,
    distortionMode,
    followSpeed,
    maxFps,
    jitterStrength,
    fadeOnLeave,
    imageLoaded,
  ]);

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    targetPointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerLeave = () => {
    if (fadeOnLeave) {
      targetPointerRef.current = { x: -1000, y: -1000 };
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className={cn("w-full h-full", className)}
      onMouseMove={handlePointerMove}
      onPointerMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onPointerLeave={handlePointerLeave}
      style={{ imageRendering: "pixelated", pointerEvents: "auto" }}
    />
  );
}

export function PixelatedCanvasDemo({
  className,
  ...props
}: PixelatedCanvasProps & { className?: string }) {
  return (
    <div className={cn("relative w-full h-full", className)} style={{ pointerEvents: "auto" }}>
      <PixelatedCanvas {...props} />
    </div>
  );
}
