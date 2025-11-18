import React from "react";

interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export function Card({ title, value, subtitle, className = "" }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </p>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
