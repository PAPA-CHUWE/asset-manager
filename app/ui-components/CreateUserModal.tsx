'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { UserPlus } from 'lucide-react'


const userSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(5, 'Phone is required'),
  role: z.enum(['admin', 'user'], { message: 'Select a role' }),
  department: z.string().min(1, 'Select a department'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type UserModalProps = {
  open: boolean
  setOpen: (value: boolean) => void
  onSuccess: (user: any) => void
  userToEdit?: any // optional: if provided, we are updating
}

export default function CreateUserModal({ open, setOpen, onSuccess, userToEdit }: UserModalProps) {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: userToEdit || {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'user',
      department: '',
      password: ''
    }
  })

  useEffect(() => {
    if (userToEdit) {
      form.reset({
        ...userToEdit,
        password: '' // clear password on edit
      })
    } else {
      form.reset({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: 'user',
        department: '',
        password: ''
      })
    }
  }, [userToEdit, form])

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    try {
      const token = sessionStorage.getItem('access_token')
      if (!token) throw new Error('No access token found')

        const endpoint = userToEdit?.id
      ? `https://asset-manager-backend-xlkf.onrender.com/admin/users/update/${userToEdit.id}`
      : 'https://asset-manager-backend-xlkf.onrender.com/admin/users/create'

      const method = userToEdit ? 'PUT' : 'POST'

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Operation failed')

      onSuccess({ ...data, _id: userToEdit?._id || result.userId })
      setOpen(false)
      form.reset()
      console.log('Operation successful:', result)
    } catch (error: any) {
      console.error('Error:', error)
      alert(error.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!userToEdit && (
        <DialogTrigger asChild>
          <Button>
            <UserPlus className='w-4 h-4 mr-2' /> Create User
          </Button>
        </DialogTrigger>
      )}

      <DialogContent
        className='sm:max-w-lg'
        onInteractOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-xl font-semibold'>
            <UserPlus size={20} /> {userToEdit ? 'Edit User' : 'Create New User'}
          </DialogTitle>
        </DialogHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {/* First Name */}
              <FormField control={form.control} name='first_name' render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter first name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Last Name */}
              <FormField control={form.control} name='last_name' render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter last name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Email */}
              <FormField control={form.control} name='email' render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='Enter email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Phone */}
              <FormField control={form.control} name='phone' render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='Enter phone' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Password */}
              <FormField control={form.control} name='password' render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='Enter password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Role & Department */}
              <div className='flex gap-4'>
                <FormField control={form.control} name='role' render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='admin'>Admin</SelectItem>
                        <SelectItem value='user'>User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name='department' render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select department' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='IT'>IT</SelectItem>
                        <SelectItem value='Finance'>Finance</SelectItem>
                        <SelectItem value='HR'>HR</SelectItem>
                        <SelectItem value='Procurement'>Procurement</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <Button type='submit' className='w-full mt-2'>
                {userToEdit ? 'Update User' : 'Create User'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </DialogContent>
    </Dialog>
  )
}


