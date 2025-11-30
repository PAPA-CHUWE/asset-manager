'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { User2 } from 'lucide-react'

interface ViewUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  data?: any
  userId?: string
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({
  open,
  onOpenChange,
  title = 'User Details',
  data,
  userId
}) => {
  const [user, setUser] = useState<any>(data || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return

    const fetchUser = async () => {
      if (data) return
      if (!userId) return

      setLoading(true)
      const token = sessionStorage.getItem('access_token')
      if (!token) return setLoading(false)

      try {
        const res = await fetch(
          `https://asset-manager-backend-xlkf.onrender.com/admin/users/list-user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const result = await res.json()
        if (result.success && result.user) setUser(result.user)
      } catch (err) {
        console.error('Failed to fetch user:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [open, data, userId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='sm:max-w-md w-full max-h-[90vh] overflow-auto p-0'
        onInteractOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        {/* Header with background */}
        <DialogHeader className=' text-white p-4 rounded-t-md flex items-center gap-2 [&>button]:text-white  '>
         
          <DialogTitle className='text-xl font-bold'>{title}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className='text-center text-slate-500 mt-6'>
            Loading user details...
          </p>
        ) : user ? (
          <Card className='mt-4 mx-4 shadow-md border rounded-md'>
            <CardHeader className='space-y-1 border-b p-4'>
              <h3 className='text-lg font-semibold'>
                {user.first_name} {user.last_name}
              </h3>
              <p className='text-sm text-slate-500'>{user.email}</p>
            </CardHeader>
            <CardContent className='space-y-3 p-4 text-sm text-slate-700'>
              <div className='flex justify-between'>
                <span className='font-medium text-slate-600'>Phone:</span>
                <span>{user.phone}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium text-slate-600'>Role:</span>
                <span className='capitalize'>{user.role}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium text-slate-600'>Department:</span>
                <span>{user.department}</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p className='text-center text-red-500 mt-6'>
            No user data available
          </p>
        )}

        <DialogFooter className='flex flex-row gap-2 p-4 justify-center w-full'>
          <Button variant='default' className=''>
            Share
          </Button>
          <Button
            variant='outline'
            className=''
            onClick={() => window.print()}
          >
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ViewUserModal
