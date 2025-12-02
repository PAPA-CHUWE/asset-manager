"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string; // optional custom styles
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
      className={`p-4 cursor-pointer hover:shadow-lg hover:shadow-card transition-all ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className="text-xl">{icon}</div>
      </CardHeader>

      <CardContent className="mt-3 p-0">
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardStatCard;
