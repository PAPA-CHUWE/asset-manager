"use client";

import React, { useState } from "react";
import { Member, UserCols } from "@/app/constants/UserCols";
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
    const newUser: Member = {
      _id: crypto.randomUUID(), // generate unique id for frontend
      fullName: `${user.first_name} ${user.last_name}`,
      email: user.email,
      phone: "-", // default empty or placeholder
      status: "active", // default status
      createdAt: new Date().toISOString(),
    }
  
    setUsers([...users, newUser]) // now compatible with UserCols
    console.log("User created:", newUser)
  }
  

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">
          Manage Users ({users.length})
        </h4>

        <div className="flex gap-2">
         
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
