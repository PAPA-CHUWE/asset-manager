import { Column } from "./UserTable"
import { Badge } from "@/components/ui/badge"

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
    render: row => (
      <Badge
        variant={row.status === "active" ? "default" : "secondary"}
        className="capitalize"
      >
        {row.status}
      </Badge>
    )
  },
  {
    key: "createdAt",
    label: "Joined Date",
    render: row => new Date(row.createdAt).toLocaleDateString()
  }
]
