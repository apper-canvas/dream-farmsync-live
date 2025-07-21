import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className, 
  label,
  error,
  children,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
          error && "border-red-500 focus:border-red-500 focus:ring-red-200",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;