import React from "react";
import { cn } from "../utils/utils";

const CirclePattern = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("pointer-events-none", className)} {...props}>
      <div className="flex items-center justify-center rounded-full border border-white/0 w-full aspect-square bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.00)_32.21%)] shadow-[0px_-18px_58px_0px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-center rounded-full border border-white/0 w-[85%] aspect-square bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.00)_32.21%)] shadow-[0px_-18px_58px_0px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-center rounded-full w-[80%] aspect-square bg-[linear-gradient(180deg,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0.00)_32.21%)] shadow-[0px_-18px_58px_0px_rgba(0,0,0,0.06)]"></div>
        </div>
      </div>
    </div>
  );
});

CirclePattern.displayName = "CirclePattern";
export default CirclePattern;
