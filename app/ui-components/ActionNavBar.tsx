'use client'

import React from 'react'
import { Trash2, Download, Slash, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'

interface ActionNavBarProps {
  selectedCount: number
  loading?: boolean
  onDeleteAll?: () => void
  onExportAll?: () => void
  onDeactivateAll?: () => void
}

export function ActionNavBar({
  selectedCount,
  loading,
  onDeleteAll,
  onExportAll,
  onDeactivateAll
}: ActionNavBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className='fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 bg-[#186ab2] border border-gray-200 rounded-lg shadow flex items-center justify-center md:w-fit max-w-full animate-fadeIn'>
      <div className='flex justify-center items-center gap-2 px-2 md:flex-row flex-col'>
        <span className='font-medium text-white capitalize tracking-widest w-[150px]'>
          selected : {selectedCount}
        </span>
        <ButtonGroup className='flex gap-0.5 md:flex-row flex-col'>
          <Button
            variant='destructive'
            size='sm'
            className='flex items-center gap-2'
            onClick={onDeleteAll}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' /> Deleting...
              </>
            ) : (
              <>
                <Trash2 className='w-4 h-4' /> Delete All
              </>
            )}
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
            onClick={onExportAll}
          >
            <Download className='w-4 h-4' /> Export All
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
            onClick={onDeactivateAll}
          >
            <Slash className='w-4 h-4' /> Deactivate All
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
