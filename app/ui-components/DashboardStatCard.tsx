"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface DashboardStatCardProps {
  title: string;
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
        ${className}
      `}
    >
      {/* Glass highlight top overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white/30 to-transparent pointer-events-none rounded-xl" />

      <CardHeader className="flex flex-row items-center justify-between p-0 relative z-10">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className="text-xl">{icon}</div>
      </CardHeader>

      <CardContent className="mt-3 p-0 relative z-10">
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardStatCard;
