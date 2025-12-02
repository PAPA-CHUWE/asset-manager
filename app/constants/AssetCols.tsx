// ./app/constants/AssetCols.tsx
import { Badge } from '@/components/ui/badge'
import { Column } from '../ui-components/UserTable'

export interface Asset {
  id: string
  name: string
  category_id?: string
  category_name?: string
  date_purchased?: string
  cost?: number
  department_id?: string
  department_name?: string
  created_by?: string
  created_by_name?: string
  created_at?: string
}

/**
 * Helper to compute median
 */
const median = (numbers: number[]) => {
  if (!numbers.length) return 0
  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return numbers.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

/**
 * Asset Columns
 */
export const AssetCols = (assets: Asset[]): Column<Asset>[] => {
  const costs = assets.map(a => a.cost || 0)
  const medianCost = median(costs)

  return [
    { key: 'name', label: 'Asset Name' },
    { key: 'category_name', label: 'Category' },
    { key: 'department_name', label: 'Department' },
    { key: 'date_purchased', label: 'Date Purchased' },
    {
      key: 'cost',
      label: 'Cost',
      render: row => {
        
        const variant: 'default' | 'secondary' = row.cost && row.cost > medianCost ? 'secondary' : 'default'
        return (
          <Badge variant={variant}>
            ${row.cost?.toFixed(2) || '0.00'}
          </Badge>
        )
      }
    },
    { key: 'created_by_name', label: 'Created By' },
    {
      key: 'created_at',
      label: 'Created At',
      render: row => new Date(row.created_at || '').toLocaleDateString()
    }
  ]
}
