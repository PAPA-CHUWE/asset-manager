'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { z } from 'zod';
import { Category } from '@/app/constants/CategoryCols';

// Zod validation
export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable().optional()
});

type CategoryFormData = z.infer<typeof updateCategorySchema>;

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  category: Category | null;
  onSuccess: (category: Category) => void;
};

export default function EditCategoryModal({ open, setOpen, category, onSuccess }: Props) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  // Load category values into form
  useEffect(() => {
    if (open && category) {
      form.reset({
        name: category.name || '',
        description: category.description ?? '' // handles null → ''
      });
    }
  }, [open, category, form]);

  const onSubmit = async (data: CategoryFormData) => {
    if (!category) return;

    const token = sessionStorage.getItem('access_token');
    if (!token) return alert('Not authenticated');

    try {
      const res = await fetch(
        `https://asset-manager-backend-xlkf.onrender.com/admin/categories/update/${category.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...data,
            description: data.description === '' ? null : data.description
          })
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Update failed');
      }

      onSuccess(result.category);
      setOpen(false);
      form.reset();
    } catch (err: any) {
      console.error('Edit category error:', err);
      alert(err.message || 'Failed to update category');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Modify category details below and save changes.</DialogDescription>
        </DialogHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Category Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Category Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}
