import React from "react";
import {
  Bell,
  ClipboardList,
  DollarSign,
  FileText,
  Home,
  Package,
  Shield,
  Star,
  User,
  Wrench,
  Settings,
} from "lucide-react";

export const createOwnerNavItems = ({ pendingRequests, unreadOwnerNotifs }) => [
  { path: "/owner/overview", name: "الرئيسية", icon: <Home size={20} /> },
  { path: "/owner/equipment", name: "معداتي", icon: <Wrench size={20} /> },
  {
    path: "/owner/requests",
    name: "الطلبات الواردة",
    icon: <ClipboardList size={20} />,
    badge: pendingRequests,
  },
  { path: "/owner/contracts", name: "عقودي", icon: <FileText size={20} /> },
  {
    path: "/owner/delivery",
    name: "التسليم والإرجاع",
    icon: <Package size={20} />,
  },
  { path: "/owner/earnings", name: "الأرباح", icon: <DollarSign size={20} /> },
  { path: "/owner/insurance", name: "التأمينات", icon: <Shield size={20} /> },
  {
    path: "/owner/notifications",
    name: "الإشعارات",
    icon: <Bell size={20} />,
    badge: unreadOwnerNotifs,
    badgeRed: true,
  },
  { path: "/owner/reviews", name: "تقييماتي", icon: <Star size={20} /> },
  { path: "/owner/profile", name: "الإعدادات", icon: <Settings size={20} /> },
];

export const ownerBottomNavItems = [
  { path: "/owner/overview", name: "الرئيسية", icon: <Home size={20} /> },
  { path: "/owner/equipment", name: "معداتي", icon: <Wrench size={20} /> },
  {
    path: "/owner/requests",
    name: "الطلبات",
    icon: <ClipboardList size={20} />,
  },
  { path: "/owner/earnings", name: "الأرباح", icon: <DollarSign size={20} /> },
  { path: "/owner/profile", name: "حسابي", icon: <User size={20} /> },
];

export const getOwnerPageTitle = (pathname, navItems) =>
  navItems.find((item) => pathname.startsWith(item.path))?.name ?? "الرئيسية";
