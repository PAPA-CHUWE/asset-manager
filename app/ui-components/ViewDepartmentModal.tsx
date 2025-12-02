'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type Department = {
  id: string
  name: string
  description?: string
}

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  department: Department | null
}

const ViewDepartmentModal: React.FC<Props> = ({ open, setOpen, department }) => {
  const [deptData, setDeptData] = useState<Department | null>(null)

  useEffect(() => {
    if (open && department) {
      setDeptData(department)
    }
  }, [open, department])

  if (!deptData) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>View Department</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-4">
          <div>
            <h4 className="font-semibold">Name</h4>
            <p className="text-gray-700">{deptData.name}</p>
          </div>

          <div>
            <h4 className="font-semibold">Description</h4>
            <p className="text-gray-700">{deptData.description || '--'}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ViewDepartmentModal
