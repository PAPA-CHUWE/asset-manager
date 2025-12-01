'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { CardContent } from '@/components/ui/card'
import { UserFormData, updateUserSchema } from '../utils/updateUserSchema'

type Props = {
  open: boolean
  setOpen: (v: boolean) => void
  user: any
  onSuccess: (user: any) => void
}

export default function EditUserModal ({
  open,
  setOpen,
  user,
  onSuccess
}: Props) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'user',
      department: ''
    }
  })

  // Load user data when modal opens or user changes
  useEffect(() => {
    if (open && user) {
      form.reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user',
        department: user.department || ''
      })
    }
  }, [open, user, form])

  const onSubmit = async (data: UserFormData) => {
    try {
      const token = sessionStorage.getItem('access_token')

      // Prepare payload without password field
      const { ...payload } = data

      console.log('Sending payload:', payload) // Debug log

      const res = await fetch(
        `https://asset-manager-backend-xlkf.onrender.com/admin/users/update/${user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      )

      const result = await res.json()
      console.log('Update response:', result) // Debug log

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Update failed')
      }

      // Call onSuccess with updated user data including id
      onSuccess({
        id: user.id,
        ...payload
      })

      setOpen(false)
      form.reset() // Reset form after successful submission
    } catch (err: any) {
      console.error('Update error:', err)
      alert(err.message || 'Failed to update user')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className='max-w-2xl'
        onInteractOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user profile. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {/* First Name */}
              <FormField
                name='first_name'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter first name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                name='last_name'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter last name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                name='email'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='Enter email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                name='phone'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter phone number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role + Department */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Role */}
                <FormField
                  name='role'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue='user'
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select role' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='admin'>Admin</SelectItem>
                          <SelectItem value='user'>User</SelectItem>
                          <SelectItem value='manager'>Manager</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Department */}
                <FormField
                  name='department'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select department' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='IT'>IT</SelectItem>
                          <SelectItem value='Finance'>Finance</SelectItem>
                          <SelectItem value='HR'>HR</SelectItem>
                          <SelectItem value='Procurement'>
                            Procurement
                          </SelectItem>
                          <SelectItem value='Operations'>Operations</SelectItem>
                          <SelectItem value='Marketing'>Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex justify-end gap-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Updating...' : 'Update User'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </DialogContent>
    </Dialog>
  )
}
