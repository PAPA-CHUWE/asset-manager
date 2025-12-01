// ./app/constants/CategoryCols.ts
import { Column } from '../ui-components/UserTable'; // Reuse Column type if compatible

export type Category = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export const CategoryCols: Column<Category>[] = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'description',
    label: 'Description',
    render: row => row.description || '--',
  },
  {
    key: 'created_at',
    label: 'Created At',
    render: row => new Date(row.created_at).toLocaleString(),
  },
];
