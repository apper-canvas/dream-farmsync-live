import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  children, 
  hover = false,
  ...props 
}, ref) => {
  const Component = hover ? motion.div : "div";
  
  return (
    <Component
      ref={ref}
      whileHover={hover ? { y: -2, scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-xl bg-white p-6 shadow-lg border border-gray-100 backdrop-blur-sm transition-all duration-200",
        hover && "hover:shadow-xl cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = "Card";

export default Card;