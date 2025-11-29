"use client";

import React, { useState } from "react";
import { UserCols } from "@/app/constants/UserCols";
import { UserData } from "@/app/constants/UserData";
import UserTable from "@/app/ui-components/UserTable";
import { Button } from "@/components/ui/button";
import CreateUserModal from "@/app/ui-components/CreateUserModal";
import { z } from "zod";

const userSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  role: z.enum(["admin", "user"]),
  department: z.string(),
});

export default function ManageUsers() {
  const [users, setUsers] = useState(UserData); // dynamic user list
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateUser = (user: z.infer<typeof userSchema>) => {
    setUsers([...users, user]); // add new user to list
    console.log("User created:", user);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">
          Manage Users ({users.length})
        </h4>

        <div className="flex gap-2">
          <Button onClick={() => setModalOpen(true)}>Create User</Button>
          <CreateUserModal
            open={modalOpen}
            setOpen={setModalOpen}
            onCreate={handleCreateUser}
          />
          <Button onClick={() => console.log("Bulk Upload clicked")}>
            Bulk Upload
          </Button>
        </div>
      </div>

      <div className="mt-2">
        <UserTable
          columns={UserCols}
          data={users}
          loading={loading}
          onView={(row) => console.log("View:", row)}
          onEdit={(row) => console.log("Edit:", row)}
          onDelete={(row) => console.log("Delete:", row)}
        />
      </div>
    </div>
  );
}
