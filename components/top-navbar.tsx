"use client";

import React from 'react';
import { LogOut } from 'lucide-react';
import { useApiLogout } from '@/app/api/query-client';
import { signOut } from 'next-auth/react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter } from 'next/navigation';

export const TopNavbar = () => {
  const { mutate } = useApiLogout();
  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => signOut({ callbackUrl: '/login' }),
    });
  };
  const router = useRouter();
  const pathname = usePathname();
  const currentRole = pathname.includes('/starosta') ? 'starosta' : 'student';

  const handleRoleChange = (role: string) => {
    if (role === 'student') router.push('/dashboard/student');
    if (role === 'starosta') router.push('/dashboard/starosta');
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] bg-white border-b border-violet-200 flex items-center justify-between px-6 z-50">
      <div className="flex flex-col items-center mr-4 pr-4 p-2 min-w-[44px] min-h-[56px] mb-2">
        <div className="w-9 h-9 bg-violet-400 rounded-[7px] flex items-center justify-center relative mt-5">
          <span className="text-white text-2xl font-extrabold select-none z-10">U</span>
          <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20" width="22" height="22" viewBox="0 0 32 32" fill="none">
            <path d="M8 24L24 8" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
            <polygon points="18,10 24,8 22,14" fill="#7c3aed" />
          </svg>
        </div>
        <span className="mt-0 text-violet-600 font-semibold text-base select-none mb-2">Check In</span>
      </div>
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 font-medium text-base ml-4" onClick={handleLogout}>
          Выйти <LogOut size={20} className="text-gray-400 ml-1" />
        </button>
      </div>
    </header>
  );
};