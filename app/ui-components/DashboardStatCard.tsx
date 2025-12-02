"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface DashboardStatCardProps {
  title: string | number;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  description,
  icon,
  className = "",
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className={`
        p-4 cursor-pointer transition-all duration-300
        rounded-xl relative overflow-hidden
        ring-1 ring-ring
        backdrop-blur-md 
        bg-white/20 dark:bg-white/5 
        border border-white/30 dark:border-white/10
        shadow-sm hover:shadow-lg hover:shadow-primary/20
        hover:bg-white/30 dark:hover:bg-white/10
        group
        ${className}
      `}
    >
      <div
  style={{ backgroundColor: "var(--color-foreground)" }}
  className="absolute top-0 left-0 w-12 h-12 rounded-br-full pointer-events-none z-10"
/>

      {/* Glass highlight top overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white/30 dark:from-white/10 to-transparent pointer-events-none rounded-xl" />

      <CardHeader className="flex flex-row items-center justify-between p-0 relative z-10">
        <h4 className="text-sm  dark:text-white font-semibold text-primary z-20 pl-10">{title}</h4>

        {/* Circle Icon with hover animation */}
        <div className="transition-transform duration-300 transform group-hover:-translate-y-1 group-hover:scale-110">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full
                       bg-white/70 dark:bg-white/10 
                       shadow-sm dark:shadow-none
                       group-hover:shadow-lg group-hover:shadow-primary/30
                       text-xl"
          >
            {icon}
          </div>
        </div>
      </CardHeader>

      <CardContent className="mt-3 p-0 relative z-10">
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs dark:text-muted-foreground text-chart-1 font-semibold tracking-widest mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default DashboardStatCard;
