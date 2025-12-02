// ./app/constants/AssetCols.tsx
import { Column } from '../ui-components/UserTable';
import { Badge } from '@/components/ui/badge';

export interface Asset {
  id: string;
  name: string;
  category_id?: string;
  category_name?: string;
  date_purchased?: string;
  cost?: number;
  department_id?: string;
  department_name?: string;
  created_by?: string;
  created_by_name?: string;
  created_at?: string;
}

export const AssetCols: Column<Asset>[] = [
  { key: 'name', title: 'Asset Name' },
  { key: 'category_name', title: 'Category' },
  { key: 'department_name', title: 'Department' },
  { key: 'date_purchased', title: 'Date Purchased' },
  { key: 'cost', title: 'Cost', render: (row) => `$${row.cost?.toFixed(2) || '0.00'}` },
  { key: 'created_by_name', title: 'Created By' },
  { key: 'created_at', title: 'Created At', render: (row) => new Date(row.created_at || '').toLocaleDateString() },
];
