'use client'

import { Toaster, toast } from 'sonner'
import { CheckCircle, XCircle } from 'lucide-react'

export const AppToaster = () => {
  return (
    <Toaster
      richColors
      position="top-right"
      toastOptions={{
        duration: 10000, // 3 seconds
      }}
    />
  )
}

// 🔹 Utility functions to trigger reusable toasts
export const showSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
    icon: <CheckCircle className="text-green-500" size={20} />,
  })
}

export const showError = (message: string, description?: string) => {
  toast.error(message, {
    description,
    icon: <XCircle className="text-red-500" size={20} />,
  })
}
