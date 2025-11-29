import { Badge } from "@/components/ui/badge"
import { Column } from "../ui-components/UserTable"

export interface Member {
  _id: string
  fullName: string
  email: string
  phone: string
  status: string
  createdAt: string
}

export const UserCols: Column<Member>[] = [
  {
    key: "fullName",
    label: "Full Name"
  },
  {
    key: "email",
    label: "Email"
  },
  {
    key: "phone",
    label: "Phone Number"
  },
  {
    key: "status",
    label: "Status",
    render: row => {
      let variant: "default" | "destructive" | "secondary" = "default"

      switch (row.status.toLowerCase()) {
        case "active":
          variant = "default" // green
          break
        case "pending":
          variant = "secondary" // yellow-ish
          break
        case "inactive":
          variant = "destructive" // red
          break
        default:
          variant = "default"
      }

      return (
        <Badge variant={variant} className="capitalize">
          {row.status}
        </Badge>
      )
    }
  },
  {
    key: "createdAt",
    label: "Joined Date",
    render: row => new Date(row.createdAt).toLocaleDateString()
  }
]
