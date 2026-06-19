import Sidebar from "./Sidebar";
import {
  LayoutGrid,
  Star,
  ClipboardCheck,
  FileText,
  Bell,
  Calendar,
  IndianRupee,
  LogOut,
} from "lucide-react";

const sections = [
  {
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
      { id: "reviews-feedback", label: "Reviews & Feedback", icon: Star },
      { id: "bookings", label: "Bookings", icon: ClipboardCheck },
      { id: "articles", label: "Articles", icon: FileText },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "sessions", label: "Sessions", icon: Calendar },
      { id: "wallet", label: "Wallet", icon: IndianRupee },
    ],
  },
  {
    pinBottom: true,
    items: [{ id: "logout", label: "Logout", icon: LogOut }],
  },
];

interface TrainerSidebarProps {
  activeId?: string;
  onNavigate?: (id: string) => void;
}

export default function TrainerSidebar({ activeId, onNavigate }: TrainerSidebarProps) {
  return (
    <Sidebar
      brand="FitZone Pro"
      subtitle="TRAINER PORTAL"
      theme="slate"
      defaultActiveId="bookings"
      activeId={activeId}
      onNavigate={onNavigate}
      sections={sections}
    />
  );
}