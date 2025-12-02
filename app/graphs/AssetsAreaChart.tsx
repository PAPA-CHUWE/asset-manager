"use client";

import React, { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  // Extract unique categories
  const categories = Array.from(
    new Set(data.map((d) => d.asset_categories?.name || "Uncategorized"))
  );

  // Filter data by category
  const filteredData =
    selectedCategory === "all"
      ? data
      : data.filter((d) => d.asset_categories?.name === selectedCategory);

  // Sort and map for chart
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

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
        <CardTitle>Recent Assets Cost Over Time</CardTitle>

        {/* Category filter */}
        <Select
          value={selectedCategory}
          onValueChange={(val) => setSelectedCategory(val)}
          className="w-40 mt-2 md:mt-0"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              formatter={(value: number) => [`$${value}`, "Cost"]}
              labelFormatter={(label: string) => `Date: ${label}`}
              contentStyle={{ backgroundColor: "#1f2937", borderRadius: 6 }}
            />
            <Area
              type="monotone"
              dataKey="cost"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#colorCost)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AssetsAreaChart;
