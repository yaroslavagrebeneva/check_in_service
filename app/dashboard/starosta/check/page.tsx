"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, CheckIcon, XIcon, ClockIcon, MoreHorizontal, CalendarIcon, Search, GraduationCap, TimerIcon, CalendarPlus, CalendarX2, CalendarX2Icon, CalendarPlusIcon } from "lucide-react";

// Типы
export type AttendanceStatus = "present" | "absent" | "late";
type Pair = { time: string; name: string };
type Student = { id: number; name: string; status: AttendanceStatus; pair: Pair | null };
type Day = "Пн" | "Вт" | "Ср" | "Чт" | "Пт";

// Мок-данные
const studentsBase = [
  { id: 1, name: "Иванов Иван Иванович" },
  { id: 2, name: "Иванов Иван Иванович" },
  { id: 3, name: "Иванов Иван Иванович" },
  { id: 4, name: "Иванов Иван Иванович" },
  { id: 5, name: "Иванов Иван Иванович" },
  { id: 6, name: "Иванов Иван Иванович" },
  { id: 7, name: "Иванов Иван Иванович" },
  { id: 8, name: "Иванов Иван Иванович" },
  { id: 9, name: "Иванов Иван Иванович" },
  { id: 10, name: "Иванов Иван Иванович" },
];
const pairsByDay: Record<Day, Pair[]> = {
  Пн: [
    { time: "08:00-09:30", name: "Лекция: Теория вероятности и математическая статистка" },
    { time: "09:40-11:10", name: "Практика: База Данных" },
    { time: "11:30-13:00", name: "Лекция: Философия" },
    { time: "13:10-14:40", name: "Практика: Алгоритмизация и программирование" },
  ],
  Вт: [
    { time: "08:00-09:30", name: "Лекция: Теория вероятности и математическая статистка" },
    { time: "09:40-11:10", name: "Практика: База Данных" },
    { time: "11:30-13:00", name: "Лекция: Философия" },
    { time: "13:10-14:40", name: "Практика: Алгоритмизация и программирование" },
  ],
  Ср: [{ time: "08:00-09:30", name: "Лекция: Теория вероятности и математическая статистка" },
    { time: "09:40-11:10", name: "Практика: База Данных" },
    { time: "11:30-13:00", name: "Лекция: Философия" },
    { time: "13:10-14:40", name: "Практика: Алгоритмизация и программирование" },],
  Чт: [{ time: "08:00-09:30", name: "Лекция: Теория вероятности и математическая статистка" },
    { time: "09:40-11:10", name: "Практика: База Данных" },
    { time: "11:30-13:00", name: "Лекция: Философия" },
    { time: "13:10-14:40", name: "Практика: Алгоритмизация и программирование" },],
  Пт: [{ time: "08:00-09:30", name: "Лекция: Теория вероятности и математическая статистка" },
    { time: "09:40-11:10", name: "Практика: База Данных" },
    { time: "11:30-13:00", name: "Лекция: Философия" },
    { time: "13:10-14:40", name: "Практика: Алгоритмизация и программирование" },],
};
const days: Day[] = ["Пн", "Вт", "Ср", "Чт", "Пт"];

const statuses = [
  { key: "present" as AttendanceStatus, icon: <CheckIcon className="text-green-500" />, label: "Присутствовал" },
  { key: "absent" as AttendanceStatus, icon: <XIcon className="text-red-500" />, label: "Отсутствовал" },
  { key: "late" as AttendanceStatus, icon: <TimerIcon className="text-yellow-500" />, label: "Опоздал" },
];

function getPairType(pairName: string) {
  if (pairName.startsWith("Лекция")) return "Лекция";
  if (pairName.startsWith("Практика")) return "Практика";
  return "";
}

export default function AttendanceCheckPage() {
  const [activeDay, setActiveDay] = useState<Day>("Пн");
  const [showPairsDropdown, setShowPairsDropdown] = useState(false);
  const [filter, setFilter] = useState<"all" | "present" | "absent">("all");
  const [selectedPair, setSelectedPair] = useState<Pair | null>(null);
  const [attendance, setAttendance] = useState<Student[]>(() =>
    studentsBase.map((s) => ({ ...s, status: "present" as AttendanceStatus, pair: null }))
  );
  const [search, setSearch] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  // Пагинация (UI only)
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = attendance.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Массовое проставление пары всем студентам
  const handleSelectPair = (pair: Pair | null) => {
    setSelectedPair(pair);
    setAttendance((prev) => prev.map((s) => ({ ...s, pair })));
    setShowPairsDropdown(false);
  };

  // Смена статуса для студента
  const handleStatusChange = (id: number, status: AttendanceStatus) => {
    setAttendance((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  // Фильтрация по статусу и поиску
  const filteredAttendance = attendance.filter((s) => {
    if (filter === "present" && s.status !== "present") return false;
    if (filter === "absent" && s.status !== "absent") return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  // Пагинация
  const pagedAttendance = filteredAttendance.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Сброс пары при смене дня
  const handleDayChange = (day: Day) => {
    setActiveDay(day);
    setSelectedPair(null);
    setAttendance((prev) => prev.map((s) => ({ ...s, pair: null })));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Группа И-1-23</h1>
        {/* Календарь (UI only) */}
        <div className="relative">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-sm font-normal border-gray-300"
            onClick={() => setShowCalendar((v) => !v)}
          >
            <CalendarIcon className="w-4 h-4 mr-1" />
            Янв 20, 2023 – Янв 25, 2023
          </Button>
          {showCalendar && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow p-4 z-20 min-w-[250px]">
              <div className="text-gray-500 text-sm">(UI-заглушка календаря)</div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 mb-4 px-2 py-2 rounded-lg bg-gray-100 w-fit">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            className={
              activeDay === day
                ? "bg-white text-black font-bold rounded px-3 py-0.5 text-sm shadow"
                : "bg-transparent text-gray-400 font-medium rounded px-3 py-0.5 text-sm"
            }
            style={{ border: "none", outline: "none" }}
            onClick={() => handleDayChange(day)}
          >
            {day}
          </button>
        ))}
      </div>
      {/* Верхняя панель: поиск, фильтры, предмет (пара) */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Поиск"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded px-8 py-1.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        {/* Фильтры */}
        <Button
          type="button"
          className="flex items-center gap-2 border border-dashed border-gray-300 bg-white rounded-lg shadow-sm px-4 py-2 font-medium text-gray-900 hover:bg-gray-50"
          style={{ boxShadow: "0 1px 2px 0 rgba(16,24,40,0.05)" }}
          onClick={() => setFilter(filter === "absent" ? "all" : "absent")}
        >
          <CalendarPlusIcon className="w-4 h-4" />
          Отсутствующие
        </Button>
        <Button
          type="button"
          className="flex items-center gap-2 border border-dashed border-gray-300 bg-white rounded-lg shadow-sm px-4 py-2 font-medium text-gray-900 hover:bg-gray-50"
          style={{ boxShadow: "0 1px 2px 0 rgba(16,24,40,0.05)" }}
          onClick={() => setFilter(filter === "present" ? "all" : "present")}
        >
          <CalendarX2Icon className="w-4 h-4" />
          Присутствующие
        </Button>
        {/* Выпадающий список пар (как "Предмет") */}
        <div className="relative">
          <Button
            className="flex items-center gap-2 border border-dashed border-gray-300 bg-white rounded-lg shadow-sm px-4 py-2 font-medium text-gray-900 hover:bg-gray-50"
            style={{ boxShadow: "0 1px 2px 0 rgba(16,24,40,0.05)" }}
            onClick={() => setShowPairsDropdown((v) => !v)}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{selectedPair ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-700 border border-gray-200">
                  {selectedPair ? getPairType(selectedPair.name) : "Пара"}
                </span>
                <span className="text-gray-800 text-xs">
                  {selectedPair ? `${selectedPair.time} ${selectedPair.name.replace(/^(Лекция|Практика|Лабораторная):? ?/, "")}` : "Пара"}
                </span>
              </span>
            ) : "Предмет"}</span>
            <ChevronDownIcon className="w-4 h-4" />
          </Button>
          {showPairsDropdown && (
            <div className="absolute left-0 mt-1 bg-white border rounded shadow z-10 min-w-[220px]">
              {(pairsByDay[activeDay] || []).map((pair: Pair, idx: number) => (
                <div
                  key={idx}
                  className={`px-4 py-2 cursor-pointer hover:bg-violet-100 ${selectedPair === pair ? "bg-violet-50" : ""}`}
                  onClick={() => handleSelectPair(pair)}
                >
                  <span className="inline-block mr-2 px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-700 border border-gray-200 align-middle">
                    {getPairType(pair.name)}
                  </span>
                  <span className="align-middle">{pair.time} {pair.name.replace(/^(Лекция|Практика|Лабораторная):? ?/, "")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Таблица студентов */}
      <div className="border rounded overflow-x-auto bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Студент</th>
              <th className="px-4 py-2 text-left font-semibold">Пара</th>
              <th className="px-4 py-2 text-center font-semibold">Присутствие</th>
              <th className="px-4 py-2 text-left font-semibold">Причина</th>
              <th className="px-4 py-2 text-center font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {pagedAttendance.map((student) => (
              <tr key={student.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{student.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {selectedPair ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-700 border border-gray-200">
                        {getPairType(selectedPair.name)}
                      </span>
                      <span className="text-gray-800 text-xs">
                        {selectedPair.time} {selectedPair.name.replace(/^(Лекция|Практика|Лабораторная):? ?/, "")}
                      </span>
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex gap-2 justify-center">
                    {statuses.map((status) => {
                      let color = "border-gray-200";
                      let bg = "";
                      if (student.status === status.key) {
                        if (status.key === "present") {
                          color = "border-green-500";
                          bg = "bg-green-100";
                        } else if (status.key === "absent") {
                          color = "border-red-500";
                          bg = "bg-red-100";
                        } else if (status.key === "late") {
                          color = "border-yellow-500";
                          bg = "bg-yellow-100";
                        }
                      }
                      return (
                        <Button
                          key={status.key}
                          size="icon"
                          variant={student.status === status.key ? "default" : "outline"}
                          className={`${bg} ${color} ${student.status === status.key ? "ring-2 ring-offset-2 ring-" + (status.key === "present" ? "green-400" : status.key === "absent" ? "red-400" : "yellow-400") : ""}`}
                          onClick={() => handleStatusChange(student.id, status.key)}
                        >
                          {status.icon}
                        </Button>
                      );
                    })}
                  </div>
                </td>
                <td className="px-4 py-2 text-left text-gray-400">
                  {student.status === "absent" ? "Не указана" : ""}
                </td>
                <td className="px-4 py-2 text-center">
                  <Button size="icon" variant="ghost" className="hover:bg-gray-100">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Пагинация (UI only) */}
      <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          Rows per page
          <select className="border border-gray-200 rounded px-2 py-1 text-sm bg-white">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          Стр {page} из {totalPages}
          <Button size="icon" variant="ghost" disabled={page === 1} onClick={() => setPage(1)}>
            &#171;
          </Button>
          <Button size="icon" variant="ghost" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            &#8249;
          </Button>
          <Button size="icon" variant="ghost" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            &#8250;
          </Button>
          <Button size="icon" variant="ghost" disabled={page === totalPages} onClick={() => setPage(totalPages)}>
            &#187;
          </Button>
        </div>
      </div>
    </div>
  );
}
