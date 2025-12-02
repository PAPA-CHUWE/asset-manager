"use client";

import React, { useEffect, useState } from "react";
import DashboardStatCard from "@/app/ui-components/DashboardStatCard";
import { FolderPlus, Layers, Tags } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AssetsByCategory from "@/app/graphs/AssetsByCategory";
import AssetsByDepartmentChart from "@/app/graphs/AssetsByDepartmentChart";

const COLORS = ["#4f46e5", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

const Home = () => {
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalCost: 0,
    assetsByCategory: {} as Record<string, number>,
    assetsByDepartment: {} as Record<string, number>,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem("access_token");
        if (!token) return;

        const res = await fetch(
          "https://asset-manager-backend-xlkf.onrender.com/user/assets/stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        if (json.success && json.stats) {
          setStats(json.stats);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Transform data for recharts
  const categoryData = Object.entries(stats.assetsByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const departmentData = Object.entries(stats.assetsByDepartment).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="w-full  h-full space-y-4">
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          title="Total Assets"
          value={loading ? "..." : stats.totalAssets}
          icon={<FolderPlus />}
          description="Total number of assets"
        />
        <DashboardStatCard
          title="Total Cost"
          value={loading ? "..." : `$${stats.totalCost}`}
          icon={<Tags />}
          description="Combined cost of all assets"
        />
        <DashboardStatCard
          title="Total Categories"
          value={loading ? "..." : Object.keys(stats.assetsByCategory).length}
          icon={<FolderPlus />}
          description="Distinct categories used"
        />
        <DashboardStatCard
          title="Total Departments"
          value={loading ? "..." : Object.keys(stats.assetsByDepartment).length}
          icon={<Layers />}
          description="Departments with assets"
        />
      </div>

      {/* CHARTS */}
      <div className="w-full flex gap-4 justify-between md:flex-row flex-col">
        {/* Bar chart for categories */}
        <div className="w-full md:w-2/3 shadow-md rounded-md p-4 h-[380px] ring-1 ring-ring">
        <AssetsByCategory loading={loading} categoryData={categoryData} />

        </div>

        {/* Pie chart for departments */}
        <div className="w-full md:w-1/3 shadow-md rounded-md p-4 h-[380px] ring-1 ring-ring">
         <AssetsByDepartmentChart loading={loading} departmentData={departmentData}/>
          
        </div>
      </div>
    </div>
  );
};

export default Home;
