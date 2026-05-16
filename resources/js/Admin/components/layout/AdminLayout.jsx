import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
  Home, Users, Truck, ShoppingCart, AlertTriangle,
  DollarSign, Flag, BarChart2, Star, Clock, Settings
} from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../../../css/admin.css';

const navItems = [
  { path: route('admin.dashboard'), label: 'الرئيسية', icon: Home },
  { path: route('admin.users.index'), label: 'المستخدمون', icon: Users },
  { path: route('admin.equipment.index'), label: 'المعدات', icon: Truck },
  { path: route('admin.rentals.index'), label: 'الإيجارات', icon: ShoppingCart },
  { path: route('admin.kyc.index'), label: 'توثيق الهوية', icon: Truck },
  { path: route('admin.payments.index'), label: 'الإشراف المالي', icon: DollarSign },
  { path: route('admin.disputes.index'), label: 'النزاعات', icon: AlertTriangle },
  { path: route('admin.reviews.index'), label: 'التقييمات', icon: Star },
  { path: route('admin.audit-logs.index'), label: 'سجل العمليات', icon: Clock },
  { path: route('admin.settings.index'), label: 'الإعدادات', icon: Settings },
];

export default function AdminLayout({ children }) {
  const { url } = usePage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentTitle = navItems.find(item => url.startsWith(new URL(item.path, window.location.origin).pathname))?.label || 'الرئيسية';

  return (
    <div className="flex h-screen overflow-hidden bg-brand-content font-cairo text-brand-text-primary" dir="rtl">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navItems={navItems}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header
          currentTitle={currentTitle}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
