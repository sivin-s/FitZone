import Sidebar from "./Sidebar";
import {
  LayoutGrid,
  Users,
  Contact,
  UserCog,
  BarChart3,
  Users2,
  Wallet,
  Ticket,
  Tag,
  LogOut,
} from "lucide-react";

const sections = [
  {
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
      { id: "users", label: "Users", icon: Users },
      { id: "trainer-applications", label: "Trainer Applications", icon: Contact },
      { id: "trainers", label: "Trainers", icon: UserCog },
      { id: "reports", label: "Reports", icon: BarChart3 },
      { id: "groups-cm", label: "Groups CM", icon: Users2 },
      { id: "finance", label: "Finance", icon: Wallet },
      { id: "coupons", label: "Coupons", icon: Ticket },
      { id: "subscriptions", label: "Subscriptions", icon: Tag },
    ],
  },
  {
    pinBottom: true,
    items: [{ id: "logout", label: "Logout", icon: LogOut }],
  },
];

interface AdminSidebarProps {
  activeId?: string;
  onNavigate?: (id: string) => void;
}

export default function AdminSidebar({ activeId, onNavigate }: AdminSidebarProps) {
  return (
    <Sidebar
      brand="Admin Panel"
      subtitle="System Control"
      theme="neutral"
      defaultActiveId="coupons"
      activeId={activeId}
      onNavigate={onNavigate}
      sections={sections}
    />
  );
}