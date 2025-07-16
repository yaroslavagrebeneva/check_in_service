import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { X, File } from 'lucide-react';

interface Missed {
  id: number;
  subject: string;
  teacher: string;
  date: string;
  time: string;
  status: string;
  reason?: string;
  text?: string;
  teacherReply?: string;
}

type Mode = 'add' | 'edit' | 'view';

interface MissedReasonPanelProps {
  mode: Mode;
  missed: Missed;
  onClose: () => void;
  reason?: string;
  text?: string;
  onReasonChange?: (v: string) => void;
  onTextChange?: (v: string) => void;
  onSend?: () => void;
}

export const MissedReasonPanel: React.FC<MissedReasonPanelProps> = ({
  mode,
  missed,
  onClose,
  reason = '',
  text = '',
  onReasonChange,
  onTextChange,
  onSend,
}) => {
  const isView = mode === 'view';
  return (
    <div className="w-[600px]">
      <Card className="p-6 border border-gray-200 rounded-xl relative animate-fade-in">
        {/* Крестик закрытия */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={22} />
        </button>
        {/* Аватар и инфо */}
        <div className="flex items-center gap-3 mb-2">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
          <div>
            <div className="text-sm font-semibold">Кому: {missed.teacher}</div>
            <div className="text-xs text-muted-foreground">Преподаватель кафедры ПИ</div>
            <div className="text-xs text-muted-foreground">От кого: Иванов И.И.</div>
          </div>
        </div>
        <div className="mb-4 text-xs text-muted-foreground">{missed.date}, {missed.time}</div>
        <div className="flex gap-2 mb-2">
          <Select value={reason} onValueChange={v => onReasonChange?.(v)} disabled={isView}>
            <SelectTrigger className="w-[260px] font-medium">
              <SelectValue placeholder="Укажите тип причины" className="font-medium" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="уважительная">Уважительная</SelectItem>
              <SelectItem value="медицинская">Медицинская</SelectItem>
              <SelectItem value="другое">Другое</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-[160px] flex gap-2 items-center justify-center h-10 font-medium" disabled={isView}>
            <span>Документ</span>
            <File size={20} strokeWidth={1} />
          </Button>
        </div>
        <textarea
          className="w-full border rounded-lg p-2 mb-4 text-sm min-h-[60px]"
          placeholder="Введите текст"
          value={text}
          onChange={e => onTextChange?.(e.target.value)}
          disabled={isView}
        />
        {mode !== 'view' && (
          <div className="flex justify-center mt-4">
            <Button className="w-[200px] h-10 text-base rounded-lg bg-violet-600 text-white" onClick={onSend}>Отправить</Button>
          </div>
        )}
        {mode === 'view' && missed.teacherReply && (
          <div className="mt-4 p-3 border rounded-lg bg-gray-50 text-sm">
            <div className="font-semibold mb-1">Ответ преподавателя:</div>
            <div>{missed.teacherReply}</div>
          </div>
        )}
      </Card>
    </div>
  );
}; 