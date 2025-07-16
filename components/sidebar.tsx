'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, List, QrCode, LogOut, CalendarX, Edit } from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  const isStarosta = pathname.startsWith('/dashboard/starosta');
  const navItems = isStarosta ? [
    {
      href: '/dashboard/starosta',
      icon: BarChart2,
      label: 'Аналитика',
    },
    {
      href: '/dashboard/starosta/missed',
      icon: CalendarX,
      label: 'Список пропусков',
    },
    {
      href: '/dashboard/starosta/check',
      icon: Edit,
      label: 'Отметка посещаемости',
    },
  ] : [
    {
      href: '/dashboard/student',
      icon: BarChart2,
      label: 'Аналитика',
    },
    {
      href: '/dashboard/student/missed',
      icon: CalendarX,
      label: 'Список пропусков',
    },
    {
      href: '/dashboard/qr',
      icon: QrCode,
      label: 'Отметка qr-кода',
    },
  ];

  return (
    <aside className="hidden md:flex h-[900px] w-64 bg-white border-r border-violet-100 p-4 flex-col gap-4 shadow-sm pt-[60px]">
      <nav className="flex flex-col gap-1 mt-4 mb-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? 'flex items-center gap-2 p-2 rounded-lg bg-violet-600 text-white font-medium transition-colors shadow'
                  : 'flex items-center gap-2 p-2 rounded-lg border border-white text-black hover:bg-violet-50 font-medium transition-colors'
              }
            >
              <Icon size={20} className={active ? 'text-white' : 'text-black'} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
    </aside>
  );
};
