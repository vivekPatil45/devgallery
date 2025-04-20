import { SideNavItem } from "@/types/types";
import {
    IconHome,
    IconUser,
    IconFileText,
    IconSearch,
    IconHeart,
    IconPlus,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/user/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "My Profile",
    path: "/user/profile",
    icon: <IconUser width="24" height="24" />,
  },
  {
    title: "My Projects",
    path: "/user/my-projects",
    icon: <IconFileText width="24" height="24" />,
  },
  {
    title: "Create Project",
    path: "/user/create-project",
    icon: <IconPlus width="24" height="24" />,
  },
  {
    title: "Favorites",
    path: "/user/favorites",
    icon: <IconHeart width="24" height="24" />,
  },
];
