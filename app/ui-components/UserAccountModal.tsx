'use client'

import React, { ReactNode, useState } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover'
import { User, KeyRound, LogOut } from 'lucide-react'

import LogoutModal from './LogoutModal'

// ---------- Types ----------
interface UserAccountPopoverProps {
  children: ReactNode
}

interface MenuItemProps {
  icon: ReactNode
  label: string
  danger?: boolean
  onClick?: () => void
}

// ---------- Menu Item component ----------
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

// ---------- Main popover component ----------
export default function UserAccountPopover({ children }: UserAccountPopoverProps) {
  const [openPopover, setOpenPopover] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  const handleLogoutClick = () => {
    setOpenPopover(false)       // close the popover
    setLogoutOpen(true)         // open the logout modal
  }

  return (
    <>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>

        <PopoverContent className='w-56 p-2' align="end">
          <div className='flex flex-col'>
            <MenuItem 
              icon={<User size={16} />} 
              label='Profile'
            />

            <MenuItem 
              icon={<KeyRound size={16} />} 
              label='Change Password'
            />

            <div className='border-t my-2' />

            <MenuItem 
              icon={<LogOut size={16} />} 
              label='Logout' 
              danger 
              onClick={handleLogoutClick}
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Logout Confirmation Modal */}
      <LogoutModal 
        open={logoutOpen} 
        onOpenChange={setLogoutOpen}
      />
    </>
  )
}
