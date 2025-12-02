"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

interface RecentAsset {
  id: string;
  name: string;
  category_id: string;
  date_purchased: string;
  cost: number;
  asset_categories?: {
    name: string;
  };
}

interface AssetsAreaChartProps {
  data: RecentAsset[];
}

const AssetsAreaChart: React.FC<AssetsAreaChartProps> = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { theme } = useTheme(); // next-themes hook

  const categories = Array.from(
    new Set(data.map((d) => d.asset_categories?.name || "Uncategorized"))
  );

  const filteredData =
    selectedCategory === "all"
      ? data
      : data.filter((d) => d.asset_categories?.name === selectedCategory);

  const chartData = filteredData
    .slice()
    .sort(
      (a, b) =>
        new Date(a.date_purchased).getTime() -
        new Date(b.date_purchased).getTime()
    )
    .map((asset) => ({
      name: asset.name,
      cost: asset.cost,
      date: asset.date_purchased,
      category: asset.asset_categories?.name || "Uncategorized",
    }));

  const isLight = theme === "light";

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
        <CardTitle>Recent Assets Cost Over Time</CardTitle>
      </CardHeader>

      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isLight ? "#4ade80" : "#22c55e"}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={isLight ? "#4ade80" : "#22c55e"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={isLight ? "oklch(0.129 0.042 264.695)" : "#374151"} strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke={isLight ? "#374151" : "#d1d5db"} />
            <YAxis stroke={isLight ? "#374151" : "#d1d5db"} />
            <Tooltip
              formatter={(value: number) => [`$${value}`, "Cost"]}
              labelFormatter={(label: string) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: isLight ? "#f9fafb" : "#1f2937",
                color: isLight ? "#111827" : "#f9fafb",
                borderRadius: 6,
              }}
            />
            <Area
              type="monotone"
              dataKey="cost"
              stroke={isLight ? "#16a34a" : "#22c55e"}
              fillOpacity={1}
              fill="url(#colorCost)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AssetsAreaChart
