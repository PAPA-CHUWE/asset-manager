// ./app/constants/UserCols.tsx
import { Badge } from '@/components/ui/badge'
import { Column } from '../ui-components/UserTable'

export interface Member {
  id: string
  fullName: string
  email: string
  phone: string
  role?: string
  department?: string
  status: string
  createdAt: string
}

export const UserCols: Column<Member>[] = [
  {
    key: 'fullName',
    label: 'Full Name'
  },
  {
    key: 'email',
    label: 'Email'
  },
  {
    key: 'phone',
    label: 'Phone Number',
    render: row => row.phone || '--'
  },
  {
    key: 'status',
    label: 'Status',
    render: row => {
      const statusVariant: Record<string, 'default' | 'destructive' | 'secondary'> = {
        active: 'default',      // green
        pending: 'secondary',   // yellow-ish
        inactive: 'destructive' // red
      }

      const variant = statusVariant[row.status.toLowerCase()] ?? 'default'

      return (
        <Badge variant={variant} className='capitalize'>
          {row.status}
        </Badge>
      )
    }
  },
  {
    key: 'createdAt',
    label: 'Joined Date',
    render: row => new Date(row.createdAt).toLocaleDateString()
  }
]
