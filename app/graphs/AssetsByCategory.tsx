"use client";

import React from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  Bar,
  Line,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface AssetsByCategoryProps {
  loading: boolean;
  categoryData: { name: string; value: number; uv?: number; amt?: number }[];
  isAnimationActive?: boolean;
}

const COLORS = [
  "oklch(0.646 0.222 41.116)",
  "oklch(0.6 0.118 184.704)",
  "oklch(0.398 0.07 227.392)",
  "oklch(0.828 0.189 84.429)",
  "oklch(0.769 0.188 70.08)",
  "oklch(0.968 0.007 247.896)" // optional 6th color for accent
];


const AssetsByCategory: React.FC<AssetsByCategoryProps> = ({
  loading,
  categoryData,
  isAnimationActive = true,
}) => {
  return (
    <div className="w-full h-[380px] shadow-md rounded-md p-4 ">
      <h3 className="text-lg font-medium mb-2">Assets by Category</h3>
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <ComposedChart data={categoryData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Area for amt */}
            <Area
              type="monotone"
              dataKey="amt"
              fill="#8884d8"
              stroke="#8884d8"
              isAnimationActive={isAnimationActive}
            />
            {/* Bar for value */}
            <Bar dataKey="value" barSize={20} fill="#413ea0" isAnimationActive={isAnimationActive}>
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
            {/* Optional Line for uv */}
            <Line
              type="monotone"
              dataKey="uv"
              stroke="#ff7300"
              isAnimationActive={isAnimationActive}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AssetsByCategory;
