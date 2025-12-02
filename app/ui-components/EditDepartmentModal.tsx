'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Department } from '../constants/DepartmentCols'

type DepartmentFormData = {
  name: string
  description?: string
}



type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  department: Department | null
  onSuccess: (dept: Department) => void
}

const EditDepartmentModal: React.FC<Props> = ({ open, setOpen, department, onSuccess }) => {
  const form = useForm<DepartmentFormData>({
    defaultValues: {
      name: '',
      description: ''
    }
  })

  const [loading, setLoading] = useState(false)

  // Load department data when modal opens
  useEffect(() => {
    if (open && department) {
      form.reset({
        name: department.name || '',
        description: department.description || ''
      })
    }
  }, [open, department, form])

  const onSubmit = async (data: DepartmentFormData) => {
    if (!department) return

    setLoading(true)
    try {
      const token = sessionStorage.getItem('access_token')
      if (!token) return

      const res = await fetch(`https://asset-manager-backend-xlkf.onrender.com/admin/departments/update/${department.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Failed to update department')

      onSuccess(result.department)
      setOpen(false)
      form.reset()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Department Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Update'}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditDepartmentModal
