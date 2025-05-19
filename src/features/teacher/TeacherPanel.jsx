import { Box, Paper, Typography, Button, Stack, Chip, Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip } from '@mui/material';
import { useState, useEffect } from 'react';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';
import { weekDays, groups, schedule } from '../../mocks/teacherScheduleMocks';
import TeacherQRModal from '../../modals/TeacherQRModal';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';

function useDynamicCode() {
  const [code, setCode] = useState('');
  useEffect(() => {
    const gen = () => String(Math.floor(100000 + Math.random() * 900000));
    setCode(gen());
    const interval = setInterval(() => setCode(gen()), 1000);
    return () => clearInterval(interval);
  }, []);
  return code;
}

function AbsenceDetailsModal({ open, onClose, student, lesson, onAccept, onReject, status }) {
  if (!student) return null;
  const hasReason = !!student.reason;
  // Статус ожидания только если есть причина и статус pending
  const isPending = hasReason && (status === 'pending' || student.status === 'pending');
  const isAccepted = hasReason && status === 'accepted';
  const isRejected = hasReason && status === 'rejected';
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 600 }}>Подробности отсутствия</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography fontWeight={500} fontSize={16}>ФИО: {student?.name}</Typography>
          <Typography fontSize={15}>Пара: {lesson?.subject} ({lesson?.time}–{lesson?.end})</Typography>
          {hasReason ? (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  icon={<DescriptionIcon sx={{ color: '#1976d2', fontSize: 20 }} />}
                  label={student?.reasonType ? `Тип: ${student.reasonType}` : 'Тип: не указан'}
                  sx={{ bgcolor: 'rgba(25,118,210,0.08)', color: '#1976d2', border: '1.5px solid #1976d2', fontWeight: 500, borderRadius: 1.5, px: 2, fontSize: 15 }}
                />
                {student?.file && (
                  <Chip
                    icon={<AttachFileIcon sx={{ color: '#757575', fontSize: 20 }} />}
                    label={student.file}
                    sx={{ bgcolor: 'rgba(117,117,117,0.08)', color: '#757575', border: '1.5px solid #757575', fontWeight: 500, borderRadius: 1.5, px: 2, fontSize: 15 }}
                    component="a"
                    href={student.fileUrl || '#'}
                    target="_blank"
                    clickable
                  />
                )}
              </Stack>
              {student?.desc && (
                <Typography fontSize={15} color="#757575" mt={1}>Описание: {student.desc}</Typography>
              )}
            </>
          ) : (
            <Typography fontSize={15} color="#757575">Причина не указана</Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        {hasReason ? (
          isAccepted ? (
            <Chip label="Причина принята" sx={{ fontWeight: 500, bgcolor: 'rgba(76,175,80,0.10)', color: '#388e3c', border: '1.5px solid #388e3c', borderRadius: 1.5, px: 2 }} />
          ) : isRejected ? (
            <Chip label="Отклонено" sx={{ fontWeight: 500, bgcolor: 'rgba(211,47,47,0.10)', color: '#d32f2f', border: '1.5px solid #d32f2f', borderRadius: 1.5, px: 2 }} />
          ) : isPending ? (
            <>
              <Button onClick={onAccept} variant="contained" sx={{ bgcolor: 'rgba(76,175,80,0.12)', color: '#388e3c', borderRadius: 2, fontWeight: 500, px: 4, border: '1.5px solid #388e3c', boxShadow: 'none', mr: 1 }}>
                Принять
              </Button>
              <Button onClick={onReject} variant="contained" sx={{ bgcolor: 'rgba(211,47,47,0.10)', color: '#d32f2f', borderRadius: 2, fontWeight: 500, px: 4, border: '1.5px solid #d32f2f', boxShadow: 'none' }}>
                Отклонить
              </Button>
            </>
          ) : null
        ) : (
          <Button onClick={onAccept} variant="contained" sx={{ bgcolor: '#111', color: '#fff', borderRadius: 2, fontWeight: 500, px: 4 }}>
            Запросить причину
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

// 1. Микро-компонент для чипа ФИО с буквой статуса
function NameStatusChip({ name, status }) {
  // Показываем только 'П' или 'Н', даже если есть другие статусы
  const letter = status === 'П' ? 'П' : 'Н';
  return (
    <Chip
      label={
        <Box display="flex" alignItems="center" gap={1}>
          <span style={{ fontWeight: 500 }}>{name}</span>
          <Box
            sx={{
              bgcolor: letter === 'П' ? 'rgba(76,175,80,0.12)' : 'rgba(211,47,47,0.10)',
              color: letter === 'П' ? '#388e3c' : '#d32f2f',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 14,
              ml: 1,
              pr: 0.5
            }}
          >
            {letter}
          </Box>
        </Box>
      }
      sx={{
        borderRadius: 2.5,
        fontSize: 14,
        fontWeight: 500,
        px: 1.5,
        py: 0.5,
        bgcolor: '#fff',
        border: '1.5px solid #e0e0e0',
        minHeight: 32,
        minWidth: 110,
        maxWidth: 220,
        display: 'inline-flex',
      }}
    />
  );
}

function VisitDetailsModal({ open, onClose, lesson }) {
  const [filter, setFilter] = useState('all');
  const [students, setStudents] = useState(lesson?.students || []);
  const [absenceModal, setAbsenceModal] = useState({ open: false, student: null, idx: null });
  const [reasonStatus, setReasonStatus] = useState({});

  useEffect(() => {
    setStudents(lesson?.students || []);
    setFilter('all');
    setReasonStatus({});
  }, [lesson, open]);

  const filtered = filter === 'all' ? students : students.filter(s => s.status === 'Н');

  const handleAccept = idx => setReasonStatus(s => ({ ...s, [idx]: 'accepted' }));
  const handleReject = idx => setReasonStatus(s => ({ ...s, [idx]: 'rejected' }));
  const handleRequest = idx => setReasonStatus(s => ({ ...s, [idx]: 'pending' }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Посещение: {lesson?.subject} ({lesson?.group})</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={1} mb={2} mt={1}>
          <Chip
            label="Все"
            clickable
            onClick={() => setFilter('all')}
            sx={{ bgcolor: filter === 'all' ? 'rgba(17,17,17,0.9)' : 'rgba(245,245,245,0.9)', color: filter === 'all' ? '#fff' : '#111', fontWeight: 500, borderRadius: 2, fontSize: 14, minHeight: 28 }}
          />
          <Chip
            label="Только отсутствующие"
            clickable
            onClick={() => setFilter('absent')}
            sx={{ bgcolor: filter === 'absent' ? 'rgba(17,17,17,0.9)' : 'rgba(245,245,245,0.9)', color: filter === 'absent' ? '#fff' : '#111', fontWeight: 500, borderRadius: 2, fontSize: 14, minHeight: 28 }}
          />
        </Stack>
        <Stack spacing={1.5}>
          {filtered.map((s, idx) => {
            const hasReason = !!s.reason;
            const isPending = hasReason && (reasonStatus[idx] === 'pending' || s.status === 'pending');
            const isAccepted = hasReason && reasonStatus[idx] === 'accepted';
            const isRejected = hasReason && reasonStatus[idx] === 'rejected';
            return (
              <Paper key={s.name} sx={{ p: 1.5, borderRadius: 2.5, display: 'flex', alignItems: 'center', bgcolor: '#fafbfc', border: '1px solid #eaeaea' }}>
                <NameStatusChip name={s.name} status={s.status} />
                <Box flex={1} />
                {s.status === 'П' ? null : (
                  <>
                    <IconButton size="small" sx={{ color: '#757575', ml: 0.5 }} onClick={() => setAbsenceModal({ open: true, student: s, idx })}>
                      <InfoOutlinedIcon />
                    </IconButton>
                    {/* Статус причины */}
                    {isPending && !isAccepted && !isRejected && (
                      <Chip label="Ожидание" sx={{ ml: 1, fontWeight: 500, bgcolor: 'rgba(189,189,189,0.10)', color: '#757575', border: '1.5px solid #bdbdbd', borderRadius: 2, fontSize: 13, minHeight: 28 }} />
                    )}
                    {isAccepted && <Chip label="Причина принята" sx={{ ml: 1, fontWeight: 500, bgcolor: 'rgba(76,175,80,0.10)', color: '#388e3c', border: '1.5px solid #388e3c', borderRadius: 2, fontSize: 13, minHeight: 28 }} />}
                    {isRejected && <Chip label="Отклонено" sx={{ ml: 1, fontWeight: 500, bgcolor: 'rgba(211,47,47,0.10)', color: '#d32f2f', border: '1.5px solid #d32f2f', borderRadius: 2, fontSize: 13, minHeight: 28 }} />}
                  </>
                )}
                {/* Если причины нет, показываем только кнопку "Запросить причину" в модалке */}
                {!hasReason && reasonStatus[idx] === 'pending' && (
                  <Chip label="Ожидание" sx={{ ml: 1, fontWeight: 500, bgcolor: 'rgba(189,189,189,0.10)', color: '#757575', border: '1.5px solid #bdbdbd', borderRadius: 2, fontSize: 13, minHeight: 28 }} />
                )}
              </Paper>
            );
          })}
          {filtered.length === 0 && <Typography color="#757575" fontSize={15}>Нет студентов</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Закрыть</Button>
      </DialogActions>
      <AbsenceDetailsModal
        open={absenceModal.open}
        onClose={() => setAbsenceModal({ open: false, student: null, idx: null })}
        student={absenceModal.student}
        lesson={lesson}
        status={reasonStatus[absenceModal.idx] || absenceModal.student?.status}
        onAccept={() => {
          if (absenceModal.student?.reason) {
            setAbsenceModal({ open: false, student: null, idx: null });
            handleAccept(absenceModal.idx);
          } else {
            setAbsenceModal({ open: false, student: null, idx: null });
            handleRequest(absenceModal.idx);
          }
        }}
        onReject={() => { setAbsenceModal({ open: false, student: null, idx: null }); handleReject(absenceModal.idx); }}
      />
    </Dialog>
  );
}

function OtrabotkaCard({ lessons, groups }) {
  const [group, setGroup] = useState(groups[0] || '');
  const [otrabModal, setOtrabModal] = useState({ open: false, idx: null });
  // Собираем студентов с Н по выбранной группе
  const absentStudents = [];
  lessons.forEach(lesson => {
    if (lesson.group === group) {
      lesson.students.forEach((s, idx) => {
        if (s.status === 'Н') {
          absentStudents.push({ ...s, lesson, idx });
        }
      });
    }
  });
  const [students, setStudents] = useState(absentStudents);
  useEffect(() => {
    setStudents(absentStudents);
  }, [group, lessons]);

  const handleOtrab = (idx, result) => {
    setStudents(students => students.map((s, i) => i === idx ? { ...s, otrab: result } : s));
    setOtrabModal({ open: false, idx: null });
  };

  return (
    <Paper elevation={2} sx={{ borderRadius: 12, p: 4, flex: 1, width: '100%', mb: 2, mt: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={600} fontSize={18}>Отработка</Typography>
        <Stack direction="row" spacing={1}>
          {groups.map(g => (
            <Chip
              key={g}
              label={g}
              clickable
              onClick={() => setGroup(g)}
              sx={{
                bgcolor: group === g ? '#111' : '#f5f5f5',
                color: group === g ? '#fff' : '#111',
                fontWeight: 500,
                borderRadius: 2,
                fontSize: 14,
                minHeight: 28
              }}
            />
          ))}
        </Stack>
      </Stack>
      <Stack spacing={1.5}>
        {students.length === 0 && <Typography color="#757575" fontSize={15}>Нет студентов с отсутствиями</Typography>}
        {students.map((s, idx) => (
          <Paper key={s.name + s.lesson.time} sx={{ p: 1.2, borderRadius: 2.5, display: 'flex', alignItems: 'center', bgcolor: '#fafbfc', border: '1px solid #eaeaea' }}>
            <NameStatusChip name={s.name} status={s.status} />
            <Typography fontSize={13} color="#757575" ml={2} mr={2}>{s.lesson.subject} ({s.lesson.time}–{s.lesson.end})</Typography>
            <Chip
              label={s.otrab === '+0.75' ? 'Отработка: +0.75' : s.otrab === '-1' ? 'Не отработал: -1' : 'Отработка'}
              onClick={() => setOtrabModal({ open: true, idx })}
              sx={{
                bgcolor: s.otrab ? (s.otrab === '+0.75' ? 'rgba(76,175,80,0.10)' : 'rgba(211,47,47,0.10)') : 'rgba(245,245,245,0.9)',
                color: s.otrab ? (s.otrab === '+0.75' ? '#388e3c' : '#d32f2f') : '#111',
                border: s.otrab ? (s.otrab === '+0.75' ? '1.5px solid #388e3c' : '1.5px solid #d32f2f') : '1.5px solid #bdbdbd',
                fontWeight: 500,
                borderRadius: 2,
                fontSize: 13,
                minHeight: 28,
                ml: 1,
                cursor: 'pointer',
                px: 2
              }}
            />
          </Paper>
        ))}
      </Stack>
      <Dialog open={otrabModal.open} onClose={() => setOtrabModal({ open: false, idx: null })} maxWidth="xs" fullWidth>
        <DialogTitle>Отработка</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Button
              variant="outlined"
              sx={{
                bgcolor: 'rgba(76,175,80,0.10)',
                color: '#388e3c',
                border: '1.5px solid #388e3c',
                borderRadius: 2.5,
                fontWeight: 700,
                fontSize: 16,
                textTransform: 'uppercase',
                px: 2,
                py: 1.2,
                boxShadow: 'none',
                '&:hover': { bgcolor: 'rgba(76,175,80,0.18)' }
              }}
              fullWidth
              onClick={() => handleOtrab(otrabModal.idx, '+0.75')}
            >
              ОТРАБОТАЛ (+0.75 БАЛЛА)
            </Button>
            <Button
              variant="outlined"
              sx={{
                bgcolor: 'rgba(211,47,47,0.10)',
                color: '#d32f2f',
                border: '1.5px solid #d32f2f',
                borderRadius: 2.5,
                fontWeight: 700,
                fontSize: 16,
                textTransform: 'uppercase',
                px: 2,
                py: 1.2,
                boxShadow: 'none',
                '&:hover': { bgcolor: 'rgba(211,47,47,0.18)' }
              }}
              fullWidth
              onClick={() => handleOtrab(otrabModal.idx, '-1')}
            >
              НЕ ОТРАБОТАЛ (-1 БАЛЛ)
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

// --- Статистика посещаемости ---
function AttendanceStatsCard({ lessons, group }) {
  let allStudents = [];
  lessons.forEach(lesson => {
    if (group === 'Все' || lesson.group === group) {
      allStudents = allStudents.concat(lesson.students);
    }
  });
  const total = allStudents.length;
  const attended = allStudents.filter(s => s.status === 'П').length;
  const missed = allStudents.filter(s => s.status === 'Н').length;
  const percent = total ? Math.round((attended / total) * 100) : 0;

  return (
    <Paper elevation={2} sx={{ borderRadius: 12, p: 4, flex: 1, width: '100%', bgcolor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', boxSizing: 'border-box' }}>
      <Typography variant="subtitle2" fontWeight={600} mb={1} color="#757575">Группа: {group}</Typography>
      <Typography variant="h6" fontWeight={600} mb={1} fontSize={16}>Статистика</Typography>
      <Stack spacing={1} mb={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography fontWeight={500} fontSize={15}>Всего:</Typography>
          <Chip label={total} sx={{ fontWeight: 600, fontSize: 15, borderRadius: 2, bgcolor: '#fafbfc', border: '1.5px solid #e0e0e0' }} />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography fontWeight={500} fontSize={15}>Присутствуют:</Typography>
          <Chip label={attended} sx={{ fontWeight: 600, fontSize: 15, borderRadius: 2, bgcolor: 'rgba(76,175,80,0.10)', color: '#388e3c', border: '1.5px solid #388e3c' }} />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography fontWeight={500} fontSize={15}>Отсутствуют:</Typography>
          <Chip label={missed} sx={{ fontWeight: 600, fontSize: 15, borderRadius: 2, bgcolor: 'rgba(211,47,47,0.10)', color: '#d32f2f', border: '1.5px solid #d32f2f' }} />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography fontWeight={500} fontSize={15}>% посещаемости:</Typography>
          <Chip label={percent + '%'} sx={{ fontWeight: 600, fontSize: 15, borderRadius: 2, bgcolor: '#fafbfc', border: '1.5px solid #e0e0e0' }} />
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function TeacherPanel() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState('Все');
  const [visitModal, setVisitModal] = useState({ open: false, lesson: null });
  const [qrOpen, setQROpen] = useState(false);
  const code = useDynamicCode();

  // Получить список групп для выбранного дня
  const lessons = schedule[selectedDay]?.lessons || [];
  const dayGroups = Array.from(new Set(lessons.map(l => l.group)));
  const groupChips = ['Все', ...dayGroups];

  // Фильтруем пары по выбранной группе
  const filteredLessons = selectedGroup === 'Все' ? lessons : lessons.filter(l => l.group === selectedGroup);

  return (
    <Box maxWidth={1200} mx="auto" mt={4}>
      <Grid container spacing={3} alignItems="stretch" sx={{overflowX: 'auto'}}>
        {/* Первый ряд */}
        <Grid item xs={12} md={10} display="flex">
          <Paper elevation={2} sx={{ borderRadius: 12, p: 4, flex: 1, width: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            
            <Typography variant="h6" fontWeight={600} mb={2}>Журнал посещаемости</Typography>
            {/* Табы по дням недели */}
            <Stack direction="row" spacing={1} mb={2}>
              {weekDays.map((d, i) => (
                <Button key={d.key} variant={selectedDay === i ? 'contained' : 'outlined'} sx={{ minWidth: 48, bgcolor: selectedDay === i ? '#757575' : '#fff', color: selectedDay === i ? '#fff' : '#757575', borderColor: '#757575', fontWeight: 600, borderRadius: 12, textTransform: 'none' }} onClick={() => { setSelectedDay(i); setSelectedGroup('Все'); }}>{d.label}</Button>
              ))}
            </Stack>
            <Typography fontWeight={600} fontSize={16} mb={2}>{schedule[selectedDay]?.day}</Typography>
            {/* Чипы групп */}
            <Stack direction="row" spacing={1} mb={2}>
              {groupChips.map(g => (
                <Chip
                  key={g}
                  label={g}
                  clickable
                  onClick={() => setSelectedGroup(g)}
                  sx={{
                    bgcolor: selectedGroup === g ? '#111' : '#f5f5f5',
                    color: selectedGroup === g ? '#fff' : '#111',
                    fontWeight: 500,
                    borderRadius: 2
                  }}
                />
              ))}
            </Stack>
            {/* Список пар */}
            <Stack spacing={2}>
              {filteredLessons.map((lesson, idx) => (
                <Paper key={lesson.time + lesson.group} elevation={1} sx={{ p: 2, borderRadius: 12, display: 'flex', flexDirection: 'column', bgcolor: '#fafbfc', boxShadow: 'none', border: '1px solid #eaeaea' }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box minWidth={60}>
                      <Typography fontSize={14} color="#757575">{lesson.time}</Typography>
                      <Typography fontSize={14} color="#757575">{lesson.end}</Typography>
                    </Box>
                    <Box flex={1}>
                      <Typography fontWeight={500} fontSize={15}>{lesson.subject}</Typography>
                      <Typography fontSize={13} color="#757575" mt={0.5}>Ауд. {lesson.room} / Группа: {lesson.group}</Typography>
                    </Box>
                    <Box>
                      <Button size="small" variant="outlined" sx={{ borderColor: '#757575', color: '#757575', fontWeight: 500, borderRadius: 12, px: 3, textTransform: 'none', mt: 1 }} onClick={() => setVisitModal({ open: true, lesson })}>
                        Посмотреть посещение
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              ))}
              {filteredLessons.length === 0 && (
                <Typography color="#757575" fontSize={15} mt={2}>Нет занятий для выбранной группы</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={2} display="flex">
          <Paper elevation={2} sx={{ borderRadius: 12, p: 3, flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
            <QrCode2Icon sx={{ color: '#111', fontSize: 120, my: 2 }} />
            <Typography fontWeight={500} fontSize={20} align="center" mt={2}>QR-код для отметки</Typography>
            <Button
              variant="contained"
              sx={{
                mt: 3,
                borderRadius: 999,
                bgcolor: '#111',
                color: '#fff',
                fontWeight: 600,
                fontSize: 17,
                px: 4,
                minHeight: 40,
                boxShadow: '0 2px 8px #0001',
                border: 'none',
                textTransform: 'none',
                '&:hover': { bgcolor: '#222' }
              }}
              onClick={() => setQROpen(true)}
            >
              Показать QR-код
            </Button>
          </Paper>
        </Grid>
        {/* Второй ряд */}
        <Grid item xs={12} md={6} display="flex">
          <OtrabotkaCard lessons={lessons} groups={dayGroups} />
        </Grid>
        <Grid item xs={12} md={6} display="flex">
          <AttendanceStatsCard lessons={lessons} group={selectedGroup} />
        </Grid>
      </Grid>
      <VisitDetailsModal open={visitModal.open} onClose={() => setVisitModal({ open: false, lesson: null })} lesson={visitModal.lesson} />
      <TeacherQRModal open={qrOpen} onClose={() => setQROpen(false)} />
    </Box>
  );
} 