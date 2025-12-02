"use client";

import React, { useEffect, useState } from "react";
import DashboardStatCard from "@/app/ui-components/DashboardStatCard";
import { FolderPlus, Layers, Users } from "lucide-react";

const Home = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch(
        "https://asset-manager-backend-xlkf.onrender.com/admin/stats/stats",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        }
      );

      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="w-full flex justify-center items-center py-20 text-xl">
        Loading dashboard…
      </div>
    );

  if (!stats)
    return (
      <div className="w-full flex justify-center items-center py-20 text-xl">
        Failed to load dashboard stats.
      </div>
    );

  return (
    <div className="w-full md:h-[50vh] h-full">
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <DashboardStatCard
          title="Total Assets"
          value={stats.total_assets}
          icon={<FolderPlus />}
          description="Total number of assets in the system"
        />

        <DashboardStatCard
          title="Total Users"
          value={stats.total_users}
          icon={<Users />}
          description="Total number of users in the system"
        />

        <DashboardStatCard
          title="Total Departments"
          value={stats.total_departments}
          icon={<Layers />}
          description="Total number of departments in the system"
        />

        <DashboardStatCard
          title="Total Categories"
          value={stats.total_categories}
          icon={<FolderPlus />}
          description="Total number of categories in the system"
        />
      </div>

      {/* BOTTOM SECTION (Charts, Lists etc.) */}
      <div className="w-full h-full flex gap-4 justify-between md:flex-row flex-col">
        <div className="w-full md:w-2/3 shadow-md rounded-md p-4 h-[380px] ring-1 ring-ring">
          {/* Chart goes here */}
        </div>

        <div className="w-full md:w-1/3 shadow-md rounded-md p-4 h-[380px] ring-1 ring-ring">
          {/* Recent assets list goes here */}
        </div>
      </div>
    </div>
  );
};

export default Home;
