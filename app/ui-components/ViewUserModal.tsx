"use client"

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViewUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  data?: any; // optional preloaded user data
  userId?: string; // fetch details if data not provided
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ open, onOpenChange, title = "User Details", data, userId }) => {
  const [user, setUser] = useState<any>(data || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchUser = async () => {
      if (data) return; // already have data
      if (!userId) return;

      setLoading(true);
      const token = sessionStorage.getItem("access_token");
      if (!token) return setLoading(false);

      try {
        const res = await fetch(`https://asset-manager-backend-xlkf.onrender.com/admin/users/list-user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success && result.user) {
          setUser(result.user);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [open, data, userId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full max-h-[90vh] overflow-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <p>Loading user details...</p>
          ) : user ? (
            <div className="space-y-2 text-sm text-slate-700">
              <div><strong>First Name:</strong> {user.first_name}</div>
              <div><strong>Last Name:</strong> {user.last_name}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Phone:</strong> {user.phone}</div>
              <div><strong>Role:</strong> {user.role}</div>
              <div><strong>Department:</strong> {user.department}</div>
            </div>
          ) : (
            <p className="text-red-500">No user data available</p>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserModal;
