import Sidebar from "./Sidebar";
import {
  LayoutGrid,
  Search,
  Calendar,
  TrendingUp,
  Utensils,
  Zap,
  FileText,
  Users2,
  Wallet,
  User,
  Tag,
  Bell,
  UserPlus,
  LogOut,
} from "lucide-react";

const sections = [
  {
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
      { id: "find-trainers", label: "Find Trainers", icon: Search },
      { id: "my-sessions", label: "My Sessions", icon: Calendar },
      { id: "progress", label: "Progress", icon: TrendingUp },
      { id: "nutrition", label: "Nutrition", icon: Utensils },
      { id: "streak", label: "Streak", icon: Zap },
      { id: "articles", label: "Articles", icon: FileText },
    ],
  },
  {
    label: "CONNECT",
    items: [
      { id: "community", label: "Community", icon: Users2 },
      { id: "wallet", label: "Wallet", icon: Wallet },
      { id: "profile", label: "Profile", icon: User },
      { id: "subscriptions", label: "Subscriptions", icon: Tag },
      { id: "notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    pinBottom: true,
    divider: true,
    items: [
      { id: "trainer-apply", label: "Trainer Apply", icon: UserPlus },
      { id: "logout", label: "Logout", icon: LogOut },
    ],
  },
];

interface TraineeSidebarProps {
  activeId?: string;
  onNavigate?: (id: string) => void;
}

export default function TraineeSidebar({ activeId, onNavigate }: TraineeSidebarProps) {
  return (
    <Sidebar
      brand="FitZone"
      subtitle="USER PORTAL"
      theme="slate"
      defaultActiveId="dashboard"
      activeId={activeId}
      onNavigate={onNavigate}
      sections={sections}
    />
  );
}