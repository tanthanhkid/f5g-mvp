'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BarChart3, Bot, Users, Home, Menu, X } from 'lucide-react';

export default function Navigation() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsOpen(false); // Đóng menu sau khi navigate
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        title={isOpen ? 'Đóng menu' : 'Mở menu navigation'}
      >
        <div className="relative">
          <Menu 
            className={`w-6 h-6 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`}
          />
          <X 
            className={`w-6 h-6 absolute top-0 left-0 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}
          />
        </div>
      </button>

      {/* Menu Items */}
      <div className={`absolute top-16 right-0 transition-all duration-300 transform ${
        isOpen 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
      }`}>
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-3 min-w-[240px]">
          <div className="flex flex-col gap-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className="flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                  title={item.description}
                  style={{
                    animationDelay: isOpen ? `${index * 50}ms` : '0ms'
                  }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-200">
                    <Icon className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 block">
                      {item.label}
                    </span>
                    <span className="text-xs text-gray-500 group-hover:text-gray-600 block leading-tight">
                      {item.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Menu Footer */}
          <div className="border-t border-gray-200 mt-3 pt-3">
            <div className="text-center">
              <span className="text-xs text-gray-400">MarTech Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 