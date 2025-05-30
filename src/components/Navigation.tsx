'use client';

import { useRouter } from 'next/navigation';
import { BarChart3, Bot, Users, Home } from 'lucide-react';

export default function Navigation() {
  const router = useRouter();

  const navItems = [
    {
      label: 'Trang chủ',
      href: '/',
      icon: Home,
      description: 'Trở về trang chủ'
    },
    {
      label: 'Analytics',
      href: '/sponsor-analytics',
      icon: BarChart3,
      description: 'Dashboard phân tích cho nhà tài trợ'
    },
    {
      label: 'Programmatic Ads',
      href: '/ad-management',
      icon: Bot,
      description: 'Quản lý quảng cáo tự động'
    },
    {
      label: 'Influencer Program',
      href: '/influencer-program',
      icon: Users,
      description: 'Chương trình đối tác influencer'
    }
  ];

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-2">
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100/80 rounded-lg transition-all duration-200 group"
                title={item.description}
              >
                <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 