import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  icon?: React.ReactNode // ✅ Add icon prop
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Yes, Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  icon // ✅ destructure icon
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='sm:max-w-md w-full max-h-[90vh] overflow-auto p-4 sm:p-6 z-150'
        onInteractOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <DialogHeader className='flex items-center gap-3'>
          {icon && <span className='text-red-600'>{icon}</span>}{' '}
          {/* Render icon */}
          <DialogTitle className='text-slate-900 text-lg font-semibold'>
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className='mt-4 text-slate-600 text-sm'>{description}</div>

        <DialogFooter className='flex gap-4 mt-6'>
          <Button
            variant='outline'
            className='flex-1'
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            variant='destructive'
            className='flex-1'
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmModal
