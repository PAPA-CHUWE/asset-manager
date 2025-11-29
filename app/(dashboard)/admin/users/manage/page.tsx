"use client"
import { useState, useEffect } from "react";
import { Member, UserCols } from "@/app/constants/UserCols";
import UserTable from "@/app/ui-components/UserTable";
import { Button } from "@/components/ui/button";
import CreateUserModal from "@/app/ui-components/CreateUserModal";

export default function ManageUsers() {
  const [users, setUsers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("access_token");
      if (!token) return setLoading(false);

      try {
        const res = await fetch("https://asset-manager-backend-xlkf.onrender.com/admin/users/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.users) {
          setUsers(data.users.map((u: any) => ({
            _id: u.id,
            fullName: `${u.first_name} ${u.last_name}`,
            email: u.email,
            phone: u.phone ?? "--",
            status: "active",
            createdAt: u.created_at,
          })));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchUsers();
  }, []);

  const handleSuccess = (user: any) => {
    setUsers(prev => {
      const index = prev.findIndex(u => u._id === user._id);
      if (index > -1) {
        // update
        const updated = [...prev];
        updated[index] = { ...updated[index], ...user, fullName: `${user.first_name} ${user.last_name}` };
        return updated;
      } else {
        // create
        return [...prev, { ...user, fullName: `${user.first_name} ${user.last_name}`, status: "active", createdAt: new Date().toISOString() }];
      }
    });
    setSelectedUser(null);
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
            userToEdit={selectedUser}
          />
          <Button onClick={() => console.log("Bulk Upload clicked")}>Bulk Upload</Button>
        </div>
      </div>

      <div className="mt-2">
        <UserTable
          columns={UserCols}
          data={users}
          loading={loading}
          onEdit={(row) => {
            setSelectedUser({
              id: row._id,
              first_name: row.fullName.split(" ")[0],
              last_name: row.fullName.split(" ")[1] || "",
              email: row.email,
              phone: row.phone,
              role: "user", // you can fetch real role if available
              department: "IT", // fetch real department
              password: ""
            });
            setModalOpen(true);
          }}
          onDelete={(row) => console.log("Delete:", row)}
          onView={(row) => console.log("View:", row)}
        />
      </div>
    </div>
  )
}
