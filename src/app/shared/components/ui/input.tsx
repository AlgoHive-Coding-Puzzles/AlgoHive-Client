import React from "react";
import { cn } from "@utils/utils";
const baseClasses =
  "bg-white/16 rounded-full py-2 px-4 outline-none text-white/90 backdrop-blur-[48px] border border-white/12 placeholder:text-surface-0/60 shadow-[0px_2px_5px_0px_rgba(255,255,255,0.06)_inset,0px_12px_20px_0px_rgba(0,0,0,0.06)]";
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) =>
  type === "search" ? (
    <div className="relative">
      <i className="pi pi-search text-surface-0 absolute left-3 leading-none z-1 top-1/2 -translate-y-1/2"></i>
      <input
        ref={ref}
        type="search"
        className={cn(baseClasses, className, "pl-10 pr-4")}
        {...props}
      />
    </div>
  ) : (
    <input
      ref={ref}
      type={type}
      className={cn(baseClasses, className)}
      {...props}
    />
  )
);

Input.displayName = "Input";

export { Input };
