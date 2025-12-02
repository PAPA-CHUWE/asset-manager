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
          title: "Manage Category",
          href: "/admin/assets/categories",
          icon: <FolderPlus size={18} />,
        },
        {
          title: "Manage Assets",
          href: "/admin/assets/manage-assets",
          icon: <Archive size={18} />,
        },
       
      ],
    },
    {
      title: "Departments",
      icon: <Layers size={20} />,
      children: [
      
        {
          title: "Manage Departments",
          href: "/admin/departments/manage",
          icon: <Archive size={18} />,
        },
      ],
    },
   
    {
      title: "Settings",
      icon: <Settings size={20} />,
      href: "/admin/settings",
    },
  ];
  