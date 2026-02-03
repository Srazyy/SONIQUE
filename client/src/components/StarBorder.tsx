import React from "react";

interface StarBorderProps {
  children: React.ReactNode;
  onClick?: () => void;
  as?: "button" | "div";
  className?: string;
  color?: string;
  speed?: string;
  disabled?: boolean;
}

const StarBorder = ({
  children,
  onClick,
  as: Component = "div",
  className = "",
  color = "cyan",
  speed = "10s",
  disabled = false,
}: StarBorderProps) => {
  return (
    <Component
      onClick={disabled ? undefined : onClick}
      className={`relative inline-flex overflow-hidden rounded-lg p-[2px] ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      disabled={disabled}
    >
      <span
        className="absolute inset-[-1000%] animate-[spin_var(--speed)_linear_infinite]"
        style={
          {
            "--speed": speed,
            background: `conic-gradient(from 0deg, transparent, ${color}, transparent 30%)`,
          } as React.CSSProperties
        }
      />
      <span className="relative z-10 flex items-center justify-center w-full h-full px-8 py-4 text-lg font-semibold bg-card rounded-lg backdrop-blur-sm">
        {children}
      </span>
    </Component>
  );
};

export default StarBorder;
