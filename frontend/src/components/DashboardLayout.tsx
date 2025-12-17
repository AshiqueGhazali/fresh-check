'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, Users, FileText, BookOpen, CheckSquare, ClipboardList, BarChart3, ChefHat, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useMemo, memo } from 'react';

const NavContent = memo(({ 
  user, 
  logout, 
  pathname, 
  onLinkClick 
}: { 
  user: any, 
  logout: () => void, 
  pathname: string, 
  onLinkClick: () => void 
}) => {
  const navItems = useMemo(() => {
    const role = user?.role;

    if (role === 'ADMIN') {
      return [
        { href: '/dashboard/admin', icon: BarChart3, label: 'Dashboard' },
        { href: '/dashboard/admin/users', icon: Users, label: 'User Management' },
        { href: '/dashboard/admin/forms', icon: FileText, label: 'Inspection Forms' },
        { href: '/dashboard/admin/guidelines', icon: BookOpen, label: 'Guidelines' },
        { href: '/dashboard/admin/reports', icon: CheckSquare, label: 'Approve Reports' },
      ];
    } else if (role === 'INSPECTOR') {
      return [
        { href: '/dashboard/inspector', icon: BarChart3, label: 'Dashboard' },
        { href: '/dashboard/inspector/forms', icon: ClipboardList, label: 'Inspection Forms' },
        { href: '/dashboard/inspector/reports', icon: FileText, label: 'My Reports' },
      ];
    } else if (role === 'KITCHEN_MANAGER') {
      return [
        { href: '/dashboard/kitchen', icon: BookOpen, label: 'Guidelines' },
        { href: '/dashboard/kitchen/reports', icon: FileText, label: 'Reports' },
      ];
    } else if (role === 'HOTEL_MANAGEMENT') {
      return [
        { href: '/dashboard/management', icon: BarChart3, label: 'Analytics' },
        { href: '/dashboard/management/reports', icon: CheckSquare, label: 'Approved Reports' },
      ];
    }
    return [];
  }, [user?.role]);

  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
              Fresh Check
            </h1>
            <p className="text-xs text-gray-500 truncate">{user?.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={item.href} onClick={onLinkClick}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium truncate">{item.label}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 flex flex-col gap-2">
        <Link href="/dashboard/settings" onClick={onLinkClick}>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </Link>
        <Button variant="outline" onClick={logout} className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </>
  );
});

NavContent.displayName = 'NavContent';

const DashboardLayout = memo(({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar - Fixed */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-gray-200 flex-col fixed h-screen">
        <NavContent 
          user={user} 
          logout={logout} 
          pathname={pathname} 
          onLinkClick={() => {}} 
        />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fresh Check
            </h1>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween' }}
            className="md:hidden fixed inset-0 bg-white z-40 flex flex-col"
            style={{ top: '73px' }}
          >
            <NavContent 
              user={user} 
              logout={logout} 
              pathname={pathname} 
              onLinkClick={() => setMobileMenuOpen(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">{user?.name}</h2>
              <p className="text-sm text-gray-600 truncate">{user?.email}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
