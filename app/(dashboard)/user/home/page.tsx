"use client";

import React, { useEffect, useState } from "react";
import DashboardStatCard from "@/app/ui-components/DashboardStatCard";
import { FolderPlus, Layers, Tags } from "lucide-react";

const Home = () => {
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalCost: 0,
    assetsByCategory: {},
    assetsByDepartment: {}
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
        console.log(json.stats)
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

  return (
    <div className="w-full md:h-[50vh] h-full space-y-4">

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* TOTAL ASSETS */}
        <DashboardStatCard
          title="Total Assets"
          value={loading ? "..." : stats.totalAssets}
          icon={<FolderPlus />}
          description="Total number of assets"
        />

        {/* TOTAL COST */}
        <DashboardStatCard
          title="Total Cost"
          value={loading ? "..." : `$${stats.totalCost}`}
          icon={<Tags />}
          description="Combined cost of all assets"
        />

        {/* TOTAL CATEGORIES */}
        <DashboardStatCard
          title="Total Categories"
          value={
            loading ? "..." : Object.keys(stats.assetsByCategory).length
          }
          icon={<FolderPlus />}
          description="Distinct categories used"
        />

        {/* TOTAL DEPARTMENTS */}
        <DashboardStatCard
          title="Total Departments"
          value={
            loading ? "..." : Object.keys(stats.assetsByDepartment).length
          }
          icon={<Layers />}
          description="Departments with assets"
        />

      </div>

      {/* CHARTS (EMPTY PLACEHOLDERS FOR NOW) */}
      <div className="w-full flex gap-4 justify-between md:flex-row flex-col">
        <div className="w-full md:w-2/3 shadow-md rounded-md p-4 h-[380px] ring-1 ring-ring"></div>
        <div className="w-full md:w-1/3 shadow-md rounded-md p-4 h-[380px] ring-1 ring-ring"></div>
      </div>
    </div>
  );
};

export default Home;
