import {
    Home,
    FolderPlus,
    Archive,
    User,
    HelpCircle,
  } from "lucide-react";
  
  export interface MenuItem {
    title: string;
    href?: string;
    icon: React.ReactNode;
    children?: MenuItem[];
  }
  
  export const UserMenuItems: MenuItem[] = [
    {
      title: "Dashboard",
      href: "/user",
      icon: <Home size={20} />,
    },
    {
      title: "Assets",
      icon: <FolderPlus size={20} />,
      children: [
        {
          title: "Create Asset",
          href: "/user/assets/create",
          icon: <FolderPlus size={18} />,
        },
        {
          title: "My Assets",
          href: "/user/assets",
          icon: <Archive size={18} />,
        },
      ],
    },
    {
      title: "Profile",
      href: "/user/profile",
      icon: <User size={20} />,
    },
    {
      title: "Help / Support",
      href: "/user/help",
      icon: <HelpCircle size={20} />,
    },
  ];
  