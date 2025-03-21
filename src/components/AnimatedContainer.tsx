import React from "react";
import { cn } from "../utils/utils";

type AnimatedContainerProps = {
  visibleClass?: string;
  notVisibleClass?: string;
  delay?: number;
};

const AnimatedContainer: React.FC<
  React.HTMLAttributes<HTMLDivElement> & AnimatedContainerProps
> = ({
  className,
  children,

  ...props
}) => {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-top-24 duration-500 !slide-in-from-top-0",

        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
