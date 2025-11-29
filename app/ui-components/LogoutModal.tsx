'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import ConfirmModal from './ConfirmModal'

interface LogoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  
}

const LogoutModal: React.FC<LogoutModalProps> = ({ open, onOpenChange }) => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('token')

      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/superuser/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      }

      // Clear session data regardless of API response
      sessionStorage.clear()

      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
      // Still clear and redirect for safety
      sessionStorage.clear()
      router.push('/')
    }
  }

  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title="Logout"
      description="Are you sure you want to logout? You will need to login again to access your account."
      confirmLabel="Logout"
      cancelLabel="Cancel"
      onConfirm={handleLogout}
      icon={<LogOut className="w-5 h-5 text-red-600" />}
    />
  )
}

export default LogoutModal
