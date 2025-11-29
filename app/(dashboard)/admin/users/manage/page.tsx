'use client'

import React, { useState } from 'react'
import { UserCols } from '@/app/constants/UserCols'
import { UserData } from '@/app/constants/UserData'
import UserTable from '@/app/ui-components/UserTable'
import { Button } from '@/components/ui/button'

const ManageUsers = () => {
  // Local state to simulate loading, can replace with actual API call
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-4">
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">
          Manage Users ({UserData.length})
        </h4>
        <div className="flex gap-2">
          <Button onClick={() => console.log('Create User clicked')}>Create User</Button>
          <Button onClick={() => console.log('Bulk Upload clicked')}>Bulk Upload</Button>
        </div>
      </div>

      {/* ---------- User Table ---------- */}
      <div className="mt-2">
        <UserTable
          columns={UserCols}
          data={UserData} // replace with fetched API data when ready
          loading={loading}
          onView={(row) => console.log('View:', row)}
          onEdit={(row) => console.log('Edit:', row)}
          onDelete={(row) => console.log('Delete:', row)}
        />
      </div>
    </div>
  )
}

export default ManageUsers
