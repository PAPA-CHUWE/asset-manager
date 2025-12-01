'use client';

import { useState, useEffect } from "react";
import { Category, CategoryCols } from "@/app/constants/CategoryCols";
import UserTable from "@/app/ui-components/UserTable";
import { Button } from "@/components/ui/button";
import CreateCategoryModal from "@/app/ui-components/CreateCategoryModal";
import ConfirmModal from "@/app/ui-components/ConfirmModal";
import EditCategoryModal from "@/app/ui-components/EditCategoryModal";
import { Trash2 } from "lucide-react";

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("access_token");
      if (!token) return setLoading(false);

      try {
        const res = await fetch(
          "https://asset-manager-backend-xlkf.onrender.com/admin/categories/list/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        console.log(data);
        if (data.success && data.categories) setCategories(data.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Add or update category
  const handleSuccess = (category: Category) => {
    setCategories((prev) => {
      const index = prev.findIndex((c) => c.id === category.id);
      if (index > -1) {
        // Update existing
        const updated = [...prev];
        updated[index] = category;
        return updated;
      }
      // Add new
      return [category, ...prev];
    });
    setSelectedCategory(null);
    setOpenCreate(false);
    setOpenEdit(false);
  };

  // Delete category
  const handleDelete = async () => {
    if (!categoryToDelete) return;

    const token = sessionStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await fetch(
        `https://asset-manager-backend-xlkf.onrender.com/admin/categories/delete/${categoryToDelete.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      setCategoryToDelete(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">Manage Categories ({categories.length})</h4>

        <div className="flex gap-2">
          <CreateCategoryModal
            open={openCreate}
            setOpen={setOpenCreate}
            onSuccess={handleSuccess}
          />
          <Button onClick={() => setOpenCreate(true)}>Create Category</Button>
          <Button onClick={() => console.log("Bulk Upload clicked")}>Bulk Upload</Button>
        </div>
      </div>

      {/* Confirm Delete */}
      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Category?"
        description="This action cannot be undone."
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        icon={<Trash2 size={20} />}
      />

      {/* Edit Category */}
      <EditCategoryModal
        open={openEdit}
        setOpen={setOpenEdit}
        category={selectedCategory}
        onSuccess={handleSuccess}
      />

      <UserTable
        columns={CategoryCols}
        data={categories}
        loading={loading}
        onEdit={(row: Category) => {
          setSelectedCategory(row);
          setOpenEdit(true);
        }}
        onDelete={(row: Category) => {
          setCategoryToDelete(row);
          setConfirmOpen(true);
        }}
      />
    </div>
  );
}
