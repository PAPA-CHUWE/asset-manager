"use client"

import React, { JSX, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button"

import {
  Edit,
  Trash2,
  Eye,
  Loader2,
  Circle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

import { motion } from "framer-motion"
import { ActionNavBar } from "./ActionNavBar"
import { DNA } from "react-loader-spinner"

// --------------------------------------------
// Types
// --------------------------------------------
export interface Column<T extends object> {
  key: keyof T
  label: string
  render?: (row: T) => React.ReactNode
}

export interface UserTableProps<T extends object> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onView?: (row: T) => void
  onSelectionChange?: (selectedRows: T[]) => void
}

// --------------------------------------------
// Component
// --------------------------------------------
function UserTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onSelectionChange
}: UserTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 8

  // --------------------------------------------
  // Pagination
  // --------------------------------------------
  const totalPages = Math.ceil(data.length / itemsPerPage)

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const goToPreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1))
  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages))

  // --------------------------------------------
  // Row Selection
  // --------------------------------------------
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

  // --------------------------------------------
  // Bulk Delete Handler
  // --------------------------------------------
  const handleBulkDelete = async () => {

    
  }

  // --------------------------------------------
  // Rendered Output
  // --------------------------------------------
  return (
    <TooltipProvider>
      <div className="overflow-x-auto rounded-lg shadow-md ring-1 ring-gray-200 h-full bg-white">
        {/* Action Bar */}
        <ActionNavBar
          selectedCount={selectedRows.size}
          onDeleteAll={handleBulkDelete}
          onExportAll={() =>
            console.log("Export:", Array.from(selectedRows).map((i) => data[i]))
          }
          onDeactivateAll={() =>
            console.log(
              "Deactivate:",
              Array.from(selectedRows).map((i) => data[i])
            )
          }
        />

        {/* Pagination (Top) */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50 text-sm text-gray-600">
            <div>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <Table className="w-full border-collapse">
          <TableHeader className="bg-gray-50">
            <TableRow>
              {/* Select All Checkbox */}
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
                    {selectedRows.size === data.length
                      ? "Deselect all"
                      : "Select all"}
                  </TooltipContent>
                </Tooltip>
              </TableHead>

              {/* Dynamic Columns */}
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className="font-semibold text-gray-700"
                >
                  {col.label}
                </TableHead>
              ))}

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading State */}
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 2}
                  className="text-center py-8"
                >
                  <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span>Loading data...</span>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Data Rows */}
            {!loading &&
              paginatedData.length > 0 &&
              paginatedData.map((row, idx) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + idx
                const selected = selectedRows.has(globalIndex)

                return (
                  <TableRow
                    key={globalIndex}
                    className={`hover:bg-gray-100 transition-colors ${
                      selected ? "bg-blue-50 hover:bg-blue-100" : ""
                    }`}
                  >
                    {/* Row Checkbox */}
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-200"
                            onClick={() => toggleRowSelection(globalIndex)}
                          >
                            {selected ? (
                              <CheckCircle2 className="w-4 h-4 text-blue-600 fill-current" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                        </TooltipTrigger>

                        <TooltipContent>
                          {selected ? "Deselect" : "Select"}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>

                    {/* Data Columns */}
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        className="text-sm text-gray-800"
                      >
                        {col.render ? col.render(row) : String(row[col.key])}
                      </TableCell>
                    ))}

                    {/* Row Actions */}
                    <TableCell>
                      <div className="flex gap-2">
                        {onEdit && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(row)}
                              >
                                <Edit className="w-4 h-4 text-blue-700" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                        )}

                        {onDelete && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(row)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        )}

                        {onView && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onView(row)}
                              >
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

            {/* Empty State */}
            {!loading && paginatedData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 2}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center text-gray-500 space-y-2"
                  >
                    <DNA visible height="120" width="120" ariaLabel="loading" />

                    <span className="text-base font-semibold text-gray-700">
                      No data available
                    </span>
                  </motion.div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}

export default UserTable as <T extends object>(
  props: UserTableProps<T>
) => JSX.Element
