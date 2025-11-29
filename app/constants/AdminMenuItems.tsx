import {
    Home,
    Users,
    FolderPlus,
    Archive,
    Trash2,
    Layers,
    BarChart2,
    Settings
  } from "lucide-react";
  
  export interface MenuItem {
    title: string;
    href?: string;
    icon: React.ReactNode;
    children?: MenuItem[];
  }
  
  export const AdminMenuItems: MenuItem[] = [
    {
      title: "Dashboard",
      href: "/admin/home",
      icon: <Home size={20} />,
    },
    {
      title: "Users",
      icon: <Users size={20} />,
      children: [
        // {
        //   title: "Create User",
        //   href: "/admin/users/create",
        //   icon: <Users size={18} />,
        // },
        {
          title: "Manage Users",
          href: "/admin/users/manage",
          icon: <Users size={18} />,
        },
      ],
    },
    {
      title: "Assets",
      icon: <FolderPlus size={20} />,
      children: [
        {
          title: "Create Asset Category",
          href: "/admin/assets/categories/create",
          icon: <Layers size={18} />,
        },
        {
          title: "View All Assets",
          href: "/admin/assets",
          icon: <Archive size={18} />,
        },
        {
          title: "Delete Assets",
          href: "/admin/assets/delete",
          icon: <Trash2 size={18} />,
        },
      ],
    },
    {
      title: "Departments",
      icon: <Layers size={20} />,
      children: [
        {
          title: "Create Department",
          href: "/admin/departments/create",
          icon: <FolderPlus size={18} />,
        },
        {
          title: "Manage Departments",
          href: "/admin/departments/manage",
          icon: <Archive size={18} />,
        },
      ],
    },
    {
      title: "Reports",
      icon: <BarChart2 size={20} />,
      href: "/admin/reports",
    },
    {
      title: "Settings",
      icon: <Settings size={20} />,
      href: "/admin/settings",
    },
  ];
  