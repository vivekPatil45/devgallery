"use client";
import React from "react";
import { useUser } from "@/context/UserContext";
import {
  IconHome,
  IconUser,
  IconFileText,
  IconSearch,
  IconHeart,
  IconPlus,
} from "@tabler/icons-react";

const UserDashboardPage = () => {
  const { user } = useUser();
  if (!user) return null;
  
  return (
    <div className="w-full flex items-center justify-center flex-col gap-4">
      <h1 className="text-3xl font-bold text-primary mb-4">
        Welcome, {user?.name}!
      </h1>
      <div className="flex flex-row flex-wrap gap-4 items-center justify-center">
        <DashboardCard
          title="My Projects"
          icon={<IconFileText />}
          path="/user/projects"
        />
        <DashboardCard
          title="Create Project"
          icon={<IconPlus />}
          path="/user/create-project"
        />
        <DashboardCard
          title="Favorites"
          icon={<IconHeart />}
          path="/user/favorites"
        />
        <DashboardCard
          title="My Profile"
          icon={<IconUser />}
          path="/user/profile"
        />
        <DashboardCard
          title="Project Search"
          icon={<IconSearch />}
          path="/user/project-search"
        />
      </div>
    </div>
  );
};

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
      className="card bg-base-300 w-1/3 shadow-lg p-4 flex items-center space-x-4 hover:bg-primary hover:text-primary-content transition"
    >
      <span className="text-3xl">{icon}</span>
      <h2 className="text-lg font-semibold">{title}</h2>
    </a>
  );
};

export default UserDashboardPage;
