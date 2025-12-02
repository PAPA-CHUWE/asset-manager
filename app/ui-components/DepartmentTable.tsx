'use client'

import React, { JSX, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Eye, Circle, CheckCircle2 } from 'lucide-react'

export interface Column<T extends object> {
  key: keyof T
  label: string
  render?: (row: T) => React.ReactNode
}

export interface DepartmentTableProps<T extends object> {
  columns?: Column<T>[]   // <-- make optional
  data?: T[]             // <-- make optional
  loading?: boolean
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onView?: (row: T) => void
  onSelectionChange?: (selectedRows: T[]) => void
}

function DepartmentTable<T extends Record<string, unknown>>({
  columns = [],        // <-- default to empty array
  data = [],           // <-- default to empty array
  loading = false,
  onEdit,
  onDelete,
  onView,
  onSelectionChange
}: DepartmentTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  const toggleRowSelection = (index: number) => {
    const updated = new Set(selectedRows)
    updated.has(index) ? updated.delete(index) : updated.add(index)
    setSelectedRows(updated)
    onSelectionChange?.(Array.from(updated).map((i) => data[i]))
  }

  const toggleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
      onSelectionChange?.([])
      return
    }
    const allIndexes = new Set(data.map((_, idx) => idx))
    setSelectedRows(allIndexes)
    onSelectionChange?.(data)
  }

  return (
    <TooltipProvider>
      <div className="overflow-x-auto rounded-lg shadow-md ring-1 ring-ring h-full bg-background">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead className="w-12 font-semibold text-gray-700">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-200"
                      onClick={toggleSelectAll}
                    >
                      {selectedRows.size === data.length ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 fill-current" />
                      ) : selectedRows.size > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 fill-current opacity-50" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {selectedRows.size === data.length ? 'Deselect all' : 'Select all'}
                  </TooltipContent>
                </Tooltip>
              </TableHead>

              {/* Safe map with default empty array */}
              {(columns || []).map((col) => (
                <TableHead key={String(col.key)} className="font-semibold text-gray-700">
                  {col.label}
                </TableHead>
              ))}

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={(columns?.length || 0) + 2} className="text-center py-8">
                  Loading departments...
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              data.map((row, idx) => {
                const selected = selectedRows.has(idx)
                return (
                  <TableRow
                    key={idx}
                    className={`${selected ? 'bg-blue-50 hover:bg-blue-100' : ''} hover:bg-gray-200`}
                  >
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-200"
                            onClick={() => toggleRowSelection(idx)}
                          >
                            {selected ? (
                              <CheckCircle2 className="w-4 h-4 text-blue-600 fill-current" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{selected ? 'Deselect' : 'Select'}</TooltipContent>
                      </Tooltip>
                    </TableCell>

                    {(columns || []).map((col) => (
                      <TableCell key={String(col.key)} className="text-sm text-accent-foreground">
                        {col.render ? col.render(row) : String(row[col.key])}
                      </TableCell>
                    ))}

                    <TableCell>
                      <div className="flex gap-2">
                        {onEdit && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
                                <Edit className="w-4 h-4 text-blue-700" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                        )}

                        {onDelete && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => onDelete(row)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        )}

                        {onView && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => onView(row)}>
                                <Eye className="w-4 h-4 text-green-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}

            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={(columns?.length || 0) + 2} className="text-center py-12">
                  No departments available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}

export default DepartmentTable as <T extends object>(
  props: DepartmentTableProps<T>
) => JSX.Element
