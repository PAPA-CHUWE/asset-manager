'use client'

import React, { ReactNode } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover'
import { User, KeyRound, LogOut } from 'lucide-react'

// ---------- Type Definitions ----------
interface UserAccountPopoverProps {
  children: ReactNode
}

interface MenuItemProps {
  icon: ReactNode
  label: string
  danger?: boolean
  onClick?: () => void
}

// ---------- MenuItem Component ----------
function MenuItem({ icon, label, danger = false, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md 
        hover:bg-accent hover:text-accent-foreground transition
        ${danger ? 'text-red-600 hover:text-red-700' : ''}`}
    >
      {icon}
      {label}
    </button>
  )
}

// ---------- Main Component ----------
export default function UserAccountPopover({ children }: UserAccountPopoverProps) {
  // Example handler functions - you can customize these
  const handleProfile = () => {
    console.log('Profile clicked')
    // Add your profile navigation logic here
  }

  const handleChangePassword = () => {
    console.log('Change Password clicked')
    // Add your change password logic here
  }

  const handleLogout = () => {
    console.log('Logout clicked')
    // Add your logout logic here
    // Example: 
    // sessionStorage.removeItem('token')
    // sessionStorage.removeItem('role')
    // window.location.href = '/login'
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className='w-56 p-2' align="end">
        <div className='flex flex-col'>
          <MenuItem 
            icon={<User size={16} />} 
            label='Profile' 
            onClick={handleProfile}
          />
          <MenuItem 
            icon={<KeyRound size={16} />} 
            label='Change Password' 
            onClick={handleChangePassword}
          />

          <div className='border-t my-2' />

          <MenuItem 
            icon={<LogOut size={16} />} 
            label='Logout' 
            danger 
            onClick={handleLogout}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}