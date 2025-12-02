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
      href: "/user/home",
      icon: <Home size={20} />,
    },
    {
      title: "Assets",
      icon: <FolderPlus size={20} />,
      children: [
        
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
  