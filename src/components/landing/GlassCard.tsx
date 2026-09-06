import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  as?: "article" | "div" | "button";
  onClick?: () => void;
};

function setSpot(el: HTMLElement, clientX: number, clientY: number) {
  const r = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${((clientX - r.left) / r.width) * 100}%`);
  el.style.setProperty("--spot-y", `${((clientY - r.top) / r.height) * 100}%`);
}

export function GlassCard({ children, className, as = "article", onClick }: GlassCardProps) {
  const onMove = (e: MouseEvent<HTMLElement>) => {
    setSpot(e.currentTarget, e.clientX, e.clientY);
  };

  const shared = {
    className: cn("glass-card", className),
    onMouseMove: onMove,
    onClick,
    "data-magnetic": true,
  };

  if (as === "button") {
    return (
      <button type="button" {...shared}>
        {children}
      </button>
    );
  }

  const Tag = as;
  return (
    <Tag
      {...shared}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e: KeyboardEvent<HTMLElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
