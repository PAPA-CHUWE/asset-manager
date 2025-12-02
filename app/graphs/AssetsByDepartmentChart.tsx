"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AssetsByDepartmentChartProps {
  loading: boolean;
  departmentData: { name: string; value: number }[];
}

const COLORS = [
  "oklch(0.646 0.222 41.116)",
  "oklch(0.6 0.118 184.704)",
  "oklch(0.398 0.07 227.392)",
  "oklch(0.828 0.189 84.429)",
  "oklch(0.769 0.188 70.08)",
  "oklch(0.968 0.007 247.896)" // optional 6th color for accent
];


const AssetsByDepartmentChart: React.FC<AssetsByDepartmentChartProps> = ({
  loading,
  departmentData,
}) => {
  return (
    <div className="w-full h-[380px] shadow-md rounded-md p-4 ">
      <h3 className="text-lg font-medium mb-2">Assets by Department</h3>
      {loading ? (
        <p className="text-muted-foreground">Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={departmentData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {departmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AssetsByDepartmentChart;
