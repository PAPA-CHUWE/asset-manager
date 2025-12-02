'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import CreateDepartmentModal from '@/app/ui-components/CreateDepartmentModal';
import EditDepartmentModal from '@/app/ui-components/EditDepartmentModal';
import ViewDepartmentModal from '@/app/ui-components/ViewDepartmentModal';
import ConfirmModal from '@/app/ui-components/ConfirmModal';
import { DepartmentCols } from '@/app/constants/DepartmentCols';
import UserTable from '@/app/ui-components/UserTable';

interface Department {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
}


const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false); // Create
  const [editOpen, setEditOpen] = useState(false);   // Edit
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  const [viewOpen, setViewOpen] = useState(false);   // View
  const [deptToView, setDeptToView] = useState<Department | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false); // Delete
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      const token = sessionStorage.getItem('access_token');
      if (!token) return setLoading(false);

      try {
        const res = await fetch('https://asset-manager-backend-xlkf.onrender.com/admin/departments/list/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        console.log(data)
        if (data.success && data.departments) setDepartments(data.departments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleSuccess = (dept: Department) => {
    setDepartments((prev) => {
      const index = prev.findIndex((d) => d.id === dept.id);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = dept;
        return updated;
      }
      return [...prev, dept];
    });
    setSelectedDept(null);
    setModalOpen(false);
    setEditOpen(false);
  };

  const handleDelete = async () => {
    if (!deptToDelete) return;

    const token = sessionStorage.getItem('access_token');
    if (!token) return;

    try {
      const res = await fetch(
        `https://asset-manager-backend-xlkf.onrender.com/admin/departments/delete/${deptToDelete.id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setDepartments((prev) => prev.filter((d) => d.id !== deptToDelete.id));
      setDeptToDelete(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Departments ({departments.length})</CardTitle>
        <Button onClick={() => setModalOpen(true)}>Add Department</Button>
      </CardHeader>

      <CardContent>
        <UserTable
          data={departments}
          columns={DepartmentCols}
          loading={loading}
          onEdit={(dept) => {
            setSelectedDept(dept);
            setEditOpen(true);
          }}
          onDelete={(dept) => {
            setDeptToDelete(dept);
            setConfirmOpen(true);
          }}
          onView={(dept) => {
            setDeptToView(dept);
            setViewOpen(true);
          }}
        />
      </CardContent>

      {/* Modals */}
      <CreateDepartmentModal open={modalOpen} setOpen={setModalOpen} onSuccess={handleSuccess} />
      <EditDepartmentModal open={editOpen} setOpen={setEditOpen} department={selectedDept} onSuccess={handleSuccess} />
      <ViewDepartmentModal open={viewOpen} setOpen={setViewOpen} department={deptToView} />
      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Department?"
        description="This action cannot be undone."
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        icon={<Trash2 size={20} />}
      />
    </Card>
  );
};

export default Departments;
