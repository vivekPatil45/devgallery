"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import {
  IconUser,
  IconFileText,
  IconSearch,
  IconHeart,
  IconPlus,
  IconCalendar,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";
import moment from "moment";

const UserDashboardPage = () => {
  const { user } = useUser();
  const [stats, setStats] = useState<{
    totalProjects: number;
    totalLikes: number;
    totalFollowers: number;
    totalFollowing: number;
    joinedAt: string;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`/api/user/stats?id=${user._id}`);
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [user]);

  if (!user || !stats) return null;

  return (
    <div className="w-full px-6 py-10 flex flex-col items-center">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white w-full max-w-4xl p-8 rounded-xl shadow-md mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user.name} 👋</h1>
        <p className="text-lg font-medium">Here&#39;s your developer stats summary!</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mb-10">
        <StatCard title="Projects" value={stats.totalProjects} icon={<IconFileText />} />
        <StatCard title="Likes" value={stats.totalLikes} icon={<IconHeart />} />
        <StatCard title="Followers" value={stats.totalFollowers} icon={<IconUsers />} />
        <StatCard title="Following" value={stats.totalFollowing} icon={<IconStar />} />
        <StatCard title="Joined" value={moment(stats.joinedAt).format("MMM YYYY")} icon={<IconCalendar />} />
      </div>

      {/* Dashboard Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <DashboardCard title="My Projects" icon={<IconFileText />} path="/user/my-projects" />
        <DashboardCard title="Create Project" icon={<IconPlus />} path="/user/create-project" />
        <DashboardCard title="Favorites" icon={<IconHeart />} path="/user/favorites" />
        <DashboardCard title="My Profile" icon={<IconUser />} path="/user/profile" />
        <DashboardCard title="Project Search" icon={<IconSearch />} path="/user/project-search" />
      </div>
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) => (
  <div className="card bg-base-200 p-6 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl">
    <div className="text-4xl text-primary mb-2">{icon}</div>
    <p className="text-2xl font-semibold">{value}</p>
    <p className="text-sm text-gray-500">{title}</p>
  </div>
);

// Dashboard Card
const DashboardCard = ({
  title,
  icon,
  path,
}: {
  title: string;
  path: string;
  icon: React.ReactNode;
}) => {
  return (
    <a
      href={path}
      className="card bg-base-300 hover:bg-primary hover:text-primary-content transition-all duration-200 p-6 shadow-lg rounded-lg flex items-center space-x-4"
    >
      <div className="text-3xl">{icon}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
    </a>
  );
};

export default UserDashboardPage;
