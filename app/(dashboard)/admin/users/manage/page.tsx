"use client";

import { useState, useEffect } from "react";
import { Member, UserCols } from "@/app/constants/UserCols";
import UserTable from "@/app/ui-components/UserTable";
import { Button } from "@/components/ui/button";
import CreateUserModal from "@/app/ui-components/CreateUserModal";
import ConfirmModal from "@/app/ui-components/ConfirmModal";
import ViewUserModal from "@/app/ui-components/ViewUserModal";
import EditUserModal from "@/app/ui-components/EditUserModal";
import { Trash2 } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false); // Create modal
  const [openEdit, setOpenEdit] = useState(false);   // Edit modal
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewUserId, setViewUserId] = useState<string | null>(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("access_token");
      if (!token) return setLoading(false);

      try {
        const res = await fetch(
          "https://asset-manager-backend-xlkf.onrender.com/admin/users/list",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();

        if (data.success && data.users) {
          setUsers(
            data.users.map((u: any) => ({
              id: u.id,
              fullName: `${u.first_name} ${u.last_name}`,
              email: u.email,
              phone: u.phone ?? "--",
              role: u.role ,
              department: u.department ,
              status: "active",
              createdAt: u.created_at
            }))
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // When a user is created or edited
  const handleSuccess = (user: any) => {
    setUsers((prev) => {
      const index = prev.findIndex((u) => u.id === user.id);

      const fullName = `${user.first_name} ${user.last_name}`;

      if (index > -1) {
        // Update existing
        const updated = [...prev];
        updated[index] = { 
          ...updated[index], 
          ...user, 
          fullName,
          role: user.role,
          department: user.department
        };
        return updated;
      }

      // Add new user
      return [
        ...prev,
        {
          ...user,
          fullName,
          role: user.role,
          department: user.department,
          status: "active",
          createdAt: new Date().toISOString()
        }
      ];
    });

    setSelectedUser(null);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!userToDelete) return;

    const token = sessionStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await fetch(
        `https://asset-manager-backend-xlkf.onrender.com/admin/users/delete/${userToDelete.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);

    } catch (err: any) {
      console.error("Delete error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">Manage Users ({users.length})</h4>

        <div className="flex gap-2">
          <CreateUserModal
            open={modalOpen}
            setOpen={setModalOpen}
            onSuccess={handleSuccess}
          />

          <Button onClick={() => console.log("Bulk Upload clicked")}>
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* Confirm Delete */}
      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete User?"
        description="This action cannot be undone."
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        icon={<Trash2 size={20} />}
      />

      {/* View User */}
      <ViewUserModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        userId={viewUserId || undefined}
        title="View User Details"
      />

      {/* Edit User */}
      <EditUserModal
        open={openEdit}
        setOpen={setOpenEdit}
        user={selectedUser}
        onSuccess={handleSuccess}
      />

      <div className="mt-2">
        <UserTable
          columns={UserCols}
          data={users}
          loading={loading}
          onEdit={(row) => {
            setSelectedUser({
              id: row.id,
              first_name: row.fullName.split(" ")[0],
              last_name: row.fullName.split(" ")[1] || "",
              email: row.email,
              phone: row.phone,
              role: row.role,
              department: row.department
            });
            setOpenEdit(true);
          }}
          onDelete={(row) => {
            setUserToDelete(row);
            setConfirmOpen(true);
          }}
          onView={(row) => {
            setViewUserId(row.id);
            setViewModalOpen(true);
          }}
        />
      </div>
    </div>
  );
}
