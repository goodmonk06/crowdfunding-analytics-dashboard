import React from "react";

interface ChartWrapperProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartWrapper({ title, children, className = "" }: ChartWrapperProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
