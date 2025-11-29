"use client";

import React, { useState, useEffect } from "react";
import { Member, UserCols } from "@/app/constants/UserCols";
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
  const [users, setUsers] = useState<Member[]>([]); // start empty
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      const token = sessionStorage.getItem("access_token"); // get token
      if (!token) {
        console.error("No access token found in sessionStorage");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://asset-manager-backend-xlkf.onrender.com/admin/users/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (data.success && data.users) {
          // Map API response to Member format expected by your table
          const mappedUsers: Member[] = data.users.map((u: any) => ({
            _id: u.id,
            fullName: `${u.first_name} ${u.last_name}`,
            email: u.email,
            phone: u.phone??"--", // placeholder
            status: "active",
            createdAt: u.created_at,
          }));

          setUsers(mappedUsers);
        } else {
          console.error("Failed to fetch users:", data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = (user: z.infer<typeof userSchema>) => {
    const newUser: Member = {
      _id: crypto.randomUUID(),
      fullName: `${user.first_name} ${user.last_name}`,
      email: user.email,
      phone: "-",
      status: "active",
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, newUser]);
    console.log("User created:", newUser);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">Manage Users ({users.length})</h4>
        <div className="flex gap-2">
          <CreateUserModal open={modalOpen} setOpen={setModalOpen} onCreate={handleCreateUser} />
          <Button onClick={() => console.log("Bulk Upload clicked")}>Bulk Upload</Button>
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
