'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Asset } from '@/app/constants/AssetCols';

// --------------------
// Zod Schema
// --------------------
export const createAssetSchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  category_id: z.string().min(1, 'Category is required'),
  department_id: z.string().min(1, 'Department is required'),
  date_purchased: z.string().min(1, 'Purchase date is required'),
  cost: z.number().min(0, 'Cost must be positive')
});

type AssetFormData = z.infer<typeof createAssetSchema>;

// --------------------
// Props
// --------------------
interface CreateAssetModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: (asset: Asset) => void;
}

// --------------------
// Component
// --------------------
const CreateAssetModal: React.FC<CreateAssetModalProps> = ({ open, setOpen, onSuccess }) => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);

  const form = useForm<AssetFormData>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      name: '',
      category_id: '',
      department_id: '',
      date_purchased: '',
      cost: 0
    }
  });

  // --------------------
  // Fetch categories & departments
  // --------------------
  useEffect(() => {
    if (!open) return;
    const token = sessionStorage.getItem('access_token');
    if (!token) return;

    const fetchData = async () => {
      try {
        const [catRes, deptRes] = await Promise.all([
          fetch('https://asset-manager-backend-xlkf.onrender.com/admin/categories/list/all', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('https://asset-manager-backend-xlkf.onrender.com/admin/departments/list/all', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        const catData = await catRes.json();
        const deptData = await deptRes.json();
        if (catData.success) setCategories(catData.categories);
        if (deptData.success) setDepartments(deptData.departments);
      } catch (err) {
        console.error('Fetch categories/departments error:', err);
      }
    };
    fetchData();
  }, [open]);

  // --------------------
  // Submit handler
  // --------------------
  const onSubmit = async (data: AssetFormData) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) return alert('Not authenticated');

    try {
      const res = await fetch('https://asset-manager-backend-xlkf.onrender.com/admin/assets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Failed to create asset');

      onSuccess(result.asset);
      setOpen(false);
      form.reset();
    } catch (err: any) {
      console.error('Create asset error:', err);
      alert(err.message || 'Failed to create asset');
    }
  };

  // --------------------
  // JSX
  // --------------------
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Asset</DialogTitle>
          <DialogDescription>Fill in the asset details and save.</DialogDescription>
        </DialogHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Asset Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="category_id"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <select {...field} className="input">
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="department_id"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department *</FormLabel>
                    <FormControl>
                      <select {...field} className="input">
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="date_purchased"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Purchased *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ------------------- */}
              {/* Cost with number fix */}
              {/* ------------------- */}
              <FormField
                name="cost"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Cost"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssetModal;
