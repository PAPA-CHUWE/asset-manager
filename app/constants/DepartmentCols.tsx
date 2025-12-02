// ./app/constants/DepartmentCols.ts

import { Column } from "../ui-components/UserTable";


export type Department = {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
};

export const DepartmentCols: Column<Department>[] = [
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
