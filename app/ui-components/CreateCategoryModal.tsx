'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

type CategoryFormData = {
  name: string;
  description?: string;
};

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSuccess: (category: any) => void;
};

const CreateCategoryModal: React.FC<Props> = ({ open, setOpen, onSuccess }) => {
  const form = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('access_token');
      const res = await fetch('https://asset-manager-backend-xlkf.onrender.com/admin/categories/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to create category');

      onSuccess(result.category);
      form.reset();
      setOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent  onInteractOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal;
