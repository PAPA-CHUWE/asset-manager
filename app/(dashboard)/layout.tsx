'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { MenuItem, UserMenuItems } from '../constants/UserMenuItems'
import { AdminMenuItems } from '../constants/AdminMenuItems'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Menu, X, Bell, Settings, User } from 'lucide-react'
import { ModeToggle } from '../theme/ModeTogle'
import UserAccountModal from '../ui-components/UserAccountModal'

interface LayoutProps {
  children: React.ReactNode
}

const SidebarItem: React.FC<{
  item: MenuItem
  onItemClick?: () => void
  pathname: string
}> = ({ item, onItemClick, pathname }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const hasActiveChild = item.children?.some(child => child.href === pathname)
  
  useEffect(() => {
    if (hasActiveChild) setIsExpanded(true)
  }, [pathname, hasActiveChild])
  
  const handleClick = () => {
    if (!hasChildren) onItemClick?.()
    else setIsExpanded(!isExpanded)
  }

  const isActive = !hasChildren && item.href === pathname

  return (
    <div className='mb-1'>
      {hasChildren ? (
        <Button
          variant='ghost'
          className='w-full justify-start gap-2 px-4 transition-colors'
          onClick={handleClick}
        >
          {item.icon}
          <span className='flex-1 text-left'>{item.title}</span>
          {isExpanded ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
        </Button>
      ) : (
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start gap-2 px-4 transition-colors',
            isActive && 'bg-primary text-primary-foreground font-medium hover:bg-primary/90'
          )}
          asChild
          onClick={handleClick}
        >
          <Link href={item.href || '#'}>
            {item.icon}
            <span>{item.title}</span>
          </Link>
        </Button>
      )}
      {hasChildren && isExpanded && (
        <div className='ml-4 mt-1 border-l-2 border-border pl-3 space-y-1'>
          {item.children.map(child => {
            const isChildActive = child.href === pathname
            return (
              <Button
                key={child.title}
                variant={isChildActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-2 px-3 transition-colors',
                  isChildActive && 'bg-primary text-primary-foreground font-medium hover:bg-primary/90'
                )}
                asChild
                onClick={onItemClick}
              >
                <Link href={child.href || '#'}>
                  {child.icon}
                  <span className='text-sm'>{child.title}</span>
                </Link>
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<string>('user')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const pathname = usePathname()

  useEffect(() => {
    const storedRole = sessionStorage.getItem('role')
    if (storedRole && storedRole.toLowerCase() !== userRole) setUserRole(storedRole.toLowerCase())
    else if (!storedRole && userRole !== 'admin') setUserRole('admin')
  }, [userRole])

  const menuItems = userRole === 'admin' ? AdminMenuItems : UserMenuItems

  const handleSidebarItemClick = () => {
    if (window.innerWidth < 1024) setIsSidebarOpen(false)
  }

  const handleNotifications = () => setNotifications(0)

  return (
    <div className='flex min-h-screen bg-background text-foreground transition-colors'>
      {/* Sidebar */}
      <aside className='fixed top-0 left-0 z-50 w-72 h-screen bg-card border-r border-border p-4 flex flex-col'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold text-card-foreground'>Asset Manager</h2>
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden'
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className='h-5 w-5' />
          </Button>
        </div>

        <ScrollArea className='flex-1'>
          <nav className='flex flex-col'>
            {menuItems.map(item => (
              <SidebarItem key={item.title} item={item} onItemClick={handleSidebarItemClick} pathname={pathname} />
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col min-w-0 ml-72'>
        <header className='sticky top-0 z-30 border-b bg-card border-border shadow-md'>
          <div className='flex items-center justify-between h-16 px-4 lg:px-6'>
            <div className='flex items-center'>
              <Button
                variant='outline'
                size='icon'
                className='lg:hidden mr-2'
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className='h-5 w-5' />
              </Button>
            </div>

            <div className='flex items-center gap-2'>
              <ModeToggle />

              <Button variant='outline' size='icon' onClick={handleNotifications} className='relative' title='Notifications'>
                <Bell className='h-5 w-5' />
                {notifications > 0 && (
                  <span className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs'>
                    {notifications}
                  </span>
                )}
              </Button>

              <Button variant='outline' size='icon' title='Settings'>
                <Settings className='h-5 w-5' />
              </Button>

              <UserAccountModal>
                <Button variant='outline' size='icon' className='ml-2' title='User profile'>
                  <User className='h-5 w-5' />
                </Button>
              </UserAccountModal>
            </div>
          </div>
        </header>

        <main className='flex-1 overflow-y-auto p-5'>{children}</main>
      </div>
    </div>
  )
}

export default Layout
