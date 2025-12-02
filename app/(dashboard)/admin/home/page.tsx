"use client";

import React, { useEffect, useState } from "react";
import DashboardStatCard from "@/app/ui-components/DashboardStatCard";
import { FolderPlus, Layers, Users } from "lucide-react";
import AssetsAreaChart from "@/app/graphs/AssetsAreaChart";

interface DepartmentStats {
  id: string;
  department_id: string;
  departments: {
    name: string;
  };
}

interface CategoryStats {
  id: string;
  category_id: string;
  asset_categories: {
    name: string;
  };
}

interface RecentAsset {
  id: string;
  name: string;
  category_id: string;
  date_purchased: string;
  cost: number;
  department_id: string;
  created_by: string;
  created_at: string;
}

interface Stats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  total_assets: number;
  total_departments: number;
  total_categories: number;
  assets_per_department: DepartmentStats[];
  assets_per_category: CategoryStats[];
  recent_assets: RecentAsset[];
}

const Home: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        <AssetsAreaChart data={stats.recent_assets} />
        </div>

        <div className="w-full md:w-1/3 shadow-md rounded-md p-4 h-[380px] ring-1 ring-ring">
          {/* Recent assets list goes here */}
          {stats.recent_assets.map((asset) => (
            <div key={asset.id} className="mb-2 border-b pb-2">
              <p className="font-medium">{asset.name}</p>
              <p className="text-sm text-muted-foreground">
                Cost: ${asset.cost} | Purchased: {asset.date_purchased}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
