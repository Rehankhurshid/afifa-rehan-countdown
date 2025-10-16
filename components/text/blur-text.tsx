"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom" | "left" | "right";
  onAnimationComplete?: () => void;
  className?: string;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 150,
  animateBy = "words",
  direction = "top",
  onAnimationComplete,
  className,
}) => {
  const [animatedItems, setAnimatedItems] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);

  const items = animateBy === "words" ? text.split(" ") : text.split("");

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    items.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setAnimatedItems((prev) => new Set([...prev, index]));
        
        if (index === items.length - 1) {
          setIsComplete(true);
          onAnimationComplete?.();
        }
      }, index * delay);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [text, delay, items.length, onAnimationComplete]);

  const getTransformStyle = (animated: boolean) => {
    if (animated) return "translate3d(0, 0, 0)";
    
    switch (direction) {
      case "top":
        return "translate3d(0, -20px, 0)";
      case "bottom":
        return "translate3d(0, 20px, 0)";
      case "left":
        return "translate3d(-20px, 0, 0)";
      case "right":
        return "translate3d(20px, 0, 0)";
      default:
        return "translate3d(0, -20px, 0)";
    }
  };

  return (
    <div className={cn("inline-block", className)}>
      {items.map((item, index) => {
        const isAnimated = animatedItems.has(index);
        return (
          <span
            key={index}
            className="inline-block transition-all duration-300 ease-out"
            style={{
              transform: getTransformStyle(isAnimated),
              filter: isAnimated ? "blur(0px)" : "blur(4px)",
              opacity: isAnimated ? 1 : 0.3,
            }}
          >
            {item}
            {animateBy === "words" && index < items.length - 1 && " "}
          </span>
        );
      })}
    </div>
  );
};

export default BlurText;