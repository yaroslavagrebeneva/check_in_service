"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlarmClock, Calendar, CalendarCheck, Clock, Eye } from 'lucide-react';
import { CalendarX } from 'lucide-react';
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useSession } from 'next-auth/react';

const stats = [
  { label: 72, value: 'Всего пар' , icon: <Calendar className="text-violet-600" size={20} /> },
  { label: 12, value: 'Опоздал(а)', icon: <AlarmClock className="text-violet-600" size={20} />, sub: '-8% чем в прошлом месяце' },
  { label: 7, value: 'Пропустил(а)', icon: <CalendarX className="text-violet-600" size={20} />, sub: '-5% чем в прошлом месяце' },
  { label: 53, value:'Посетил(а)', icon: <CalendarCheck className="text-violet-600" size={20} />, sub: '+21% чем в прошлом месяце' },
];

const missed = [
  { subject: 'База данных', teacher: 'Танишева С.С.', date: '20.05.25', time: '11:30 - 13:00', status: 'Причина не указана', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { subject: 'База данных', teacher: 'Танишева С.С.', date: '20.05.20', time: '09:00 - 10:30', status: 'Причина принята', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { subject: 'База данных', teacher: 'Танишева С.С.', date: '20.05.18', time: '13:30 - 15:00', status: 'Ожидает проверки', img: 'https://randomuser.me/api/portraits/men/65.jpg' },
];

const chartData = [
  { name: 'Jan', value: 100 },
  { name: 'Feb', value: 90 },
  { name: 'Mar', value: 90 },
  { name: 'Apr', value: 90 },
  { name: 'May', value: 40 },
  { name: 'Jun', value: 60 },
  { name: 'Jul', value: 50 },
  { name: 'Aug', value: 60 },
  { name: 'Sep', value: 70 },
  { name: 'Oct', value: 80 },
  { name: 'Nov', value: 90 },
  { name: 'Dec', value: 80 },
];

export default function DashboardPage() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [popoverOpen, setPopoverOpen] = React.useState(false);

const { data: session, status } = useSession()
console.log(session)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Панель студента</h1>
          <div className="text-muted-foreground text-sm mt-1">Иванов Иван Иванович<br/>И - 1 - 23 / Факультет экономики, менеджмента и информационных технологий / Кафедра прикладной информатики</div>
        </div>
        <div className="flex items-center gap-2">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                className="border rounded-lg px-3 py-1 text-sm bg-white/80 text-black flex items-center gap-2 hover:bg-violet-50 transition-colors cursor-pointer"
                onClick={() => setPopoverOpen(true)}
              >
                <CalendarIcon className="text-violet-600" size={18} />
                {dateRange?.from && dateRange?.to
                  ? `${format(dateRange.from, 'dd.MM.yyyy')} - ${format(dateRange.to, 'dd.MM.yyyy')}`
                  : 'Янв 20, 2023 - Фев 09, 2023'}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarPicker
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button className="bg-violet-600 hover:bg-violet-700 text-white transition-colors">Просмотреть</Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-violet-600 text-sm">Личная статистика посещения</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[320px] flex flex-col justify-end">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} style={{ fontFamily: 'inherit' }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} width={30} />
                <Tooltip cursor={{ fill: '#ede9fe' }} contentStyle={{ borderRadius: 8, fontSize: 14 }} />
                <Bar dataKey="value" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ваши пропуски</CardTitle>
            <CardDescription className="text-xs">Недавно вы пропустили:</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {missed.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg border border-violet-100 transition-shadow duration-300 hover:shadow-md">
                <img src={item.img} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{item.subject}</div>
                  <div className="text-xs text-muted-foreground">Преподаватель: {item.teacher}</div>
                  <div className="text-xs text-muted-foreground">{item.date}, {item.time}</div>
                </div>
                <div>
                  {item.status === 'Причина не указана' && <span className="px-2 py-1 rounded bg-gray-100 text-xs">{item.status}</span>}
                  {item.status === 'Причина принята' && <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">{item.status}</span>}
                  {item.status === 'Ожидает проверки' && <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">{item.status}</span>}
                </div>
              </div>
            ))}
            <Button variant="secondary" className="mt-2 w-full transition-colors">
              <a href="/dashboard/student/missed">Подробнее</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 