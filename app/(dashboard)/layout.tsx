'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { MenuItem, UserMenuItems } from '../constants/UserMenuItems';
import { AdminMenuItems } from '../constants/AdminMenuItems';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  X, 
  Bell, 
  Settings, 
  Sun, 
  Moon,
  User
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarItem: React.FC<{ item: MenuItem; onItemClick?: () => void }> = ({ item, onItemClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (!hasChildren) {
      onItemClick?.(); // Close sidebar on mobile when a leaf item is clicked
    }
  };

  return (
    <div className="mb-1">
      <div className="flex items-center">
        {hasChildren ? (
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-4"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.title}</span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-4"
            asChild
            onClick={handleClick}
          >
            <Link href={item.href || '#'}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </Button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-4 mt-1 border-l pl-3 space-y-1">
          {item.children.map((child) => (
            <SidebarItem key={child.title} item={child} onItemClick={onItemClick} />
          ))}
        </div>
      )}
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<string>('user');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notification count

  // Load role from sessionStorage
  useEffect(() => {
    const storedRole = sessionStorage.getItem('role');
    setUserRole(storedRole ? storedRole.toLowerCase() : 'admin');
  }, []);

  // Check for system preference for dark mode
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
  }, []);

  // Determine menu
  const menuItems =
    userRole === 'admin'
      ? AdminMenuItems
      : UserMenuItems;

  // Close sidebar when clicking on a link (for mobile)
  const handleSidebarItemClick = () => {
    if (window.innerWidth < 1024) { // lg breakpoint
      setIsSidebarOpen(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // You can integrate with your theme provider here
    document.documentElement.classList.toggle('dark');
  };

  const handleNotifications = () => {
    // Handle notification click - could open a dropdown or mark as read
    setNotifications(0);
    // Add your notification logic here
  };

  return (
    <div className={cn(
      "flex min-h-screen bg-background text-foreground transition-colors",
      isDarkMode ? "dark" : ""
    )}>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-border bg-card p-4 flex flex-col rounded-tr-lg rounded-br-lg transform transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Close button for mobile */}
        <div className="flex items-center justify-between mb-6 lg:justify-start">
          <h2 className="text-xl font-bold">Asset Manager</h2>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="flex flex-col">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.title} 
                item={item} 
                onItemClick={handleSidebarItemClick}
              />
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left side - Mobile menu button */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden mr-2"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold">
                  Welcome back, {userRole === 'admin' ? 'Admin' : 'User'}
                </h1>
              </div>
            </div>

            {/* Right side - Icons */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative"
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNotifications}
                className="relative"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs">
                    {notifications}
                  </span>
                )}
              </Button>

              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>

              {/* User Profile */}
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                title="User profile"
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="bg-card rounded-lg border border-border p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;