import { Box, Paper, Typography, Button, Stack, List, ListItem, ListItemText, Grid, Chip, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useState, useEffect, useRef } from 'react';
import AbsenceReasonModal from '../../modals/AbsenceReasonModal';
import AttendanceMarkModal from '../../modals/AttendanceMarkModal';
import axios from 'axios';
import { API_BASE_URL } from '../../app/config';
import { weekDays, schedule, studentsList, personalHistory, groupHistory, personalAbsences, groupAbsences, personalStats, groupStats } from '../../mocks/starostaMocks';

export default function AttendanceMarking({ userId }) {
  const [scheduleData, setScheduleData] = useState(schedule);
  const [selectedDay, setSelectedDay] = useState(0);
  const [modal, setModal] = useState({ open: false, dayIdx: null, lessonIdx: null });
  const [marking, setMarking] = useState([]);
  const [modalLesson, setModalLesson] = useState(null);
  const [history, setHistory] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [personalStatsData, setPersonalStatsData] = useState(personalStats); // Инициализируем моками
  const [groupStatsData, setGroupStatsData] = useState(groupStats); // Инициализируем моками
  const [historyView, setHistoryView] = useState('group');
  const [absencesView, setAbsencesView] = useState('group');
  const [statsView, setStatsView] = useState('group');
  const [loading, setLoading] = useState(true);
  const attendanceRef = useRef(null);

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer dummy-token`, // Замени на реальный токен
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // История (личная или групповая в зависимости от historyView)
        const historyResponse = await axiosInstance.get(`/attendances/history?user_id=${historyView === 'personal' ? userId : ''}&limit=10&start_date=2025-06-01&end_date=2025-06-20`);
        setHistory(historyResponse.data.map(item => ({
          time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(item.created_at).toLocaleDateString(),
          subject: item.lessonid || 'Предмет',
          student: item.user_id || 'Студент',
          status: item.attendance ? 'П' : 'О',
        })));

        // Пропуски (личные или групповые в зависимости от absencesView)
        const absencesResponse = await axiosInstance.get(`/attendances/?user_id=${absencesView === 'personal' ? userId : ''}&limit=10&start_date=2025-06-01&end_date=2025-06-20`);
        setAbsences(absencesResponse.data
          .filter(a => !a.attendance)
          .map(item => ({
            time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date(item.created_at).toLocaleDateString(),
            subject: item.lessonid || 'Предмет',
            student: item.user_id || 'Студент',
            reason: item.reason_id ? 'Причина отмечена' : 'Не указана',
            accepted: !!item.reason_id,
          })));

        // Личная статистика
        const personalStatsResponse = await axiosInstance.get(`/attendances/stats?user_id=${userId}&start_date=2025-06-01&end_date=2025-06-20`);
        setPersonalStatsData(personalStatsResponse.data);

        // Групповая статистика
        const groupStatsResponse = await axiosInstance.get(`/attendances/group-stats?start_date=2025-06-01&end_date=2025-06-20`);
        setGroupStatsData(groupStatsResponse.data);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, historyView, absencesView]);

  useEffect(() => {
    if (attendanceRef.current) {
      setAttendanceCardHeight(attendanceRef.current.offsetHeight);
    }
  }, [selectedDay, scheduleData]);

  const handleOpenMark = (dayIdx, lessonIdx) => {
    setMarking(scheduleData[dayIdx].lessons[lessonIdx].group.map(s => ({ ...s })));
    setModalLesson({
      ...scheduleData[dayIdx].lessons[lessonIdx],
      day: scheduleData[dayIdx].full,
    });
    setModal({ open: true, dayIdx, lessonIdx });
  };

  const handleCloseMark = () => {
    setModal({ open: false, dayIdx: null, lessonIdx: null });
    setModalLesson(null);
  };

  const handleToggleStudent = (idx) => {
    setMarking(marking.map((s, i) =>
      i === idx ? { ...s, status: s.status === 'П' ? 'Н' : 'П' } : s
    ));
  };

  const handleSaveMark = async () => {
    setLoading(true);
    try {
      const attendanceData = marking.map(s => ({
        user_id: s.id,
        attendance: s.status === 'П',
        validation_type: 'MANUAL',
        lessonid: modalLesson.subject,
      }));
      for (const data of attendanceData) {
        await axiosInstance.post('/attendances/', data, {
          params: { starosta_id: userId }, // Передаём starosta_id для устранения 403
        });
      }
      setScheduleData(scheduleData.map((d, di) =>
        di === modal.dayIdx ? {
          ...d,
          lessons: d.lessons.map((l, li) =>
            li === modal.lessonIdx ? { ...l, group: marking } : l
          )
        } : d
      ));
      handleCloseMark();
    } catch (error) {
      console.error('Ошибка сохранения:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const [attendanceCardHeight, setAttendanceCardHeight] = useState(0);

  if (loading) return <LinearProgress />;

  return (
    <Box maxWidth={1200} mx="auto" mt={4}>
      <Grid container spacing={3} alignItems="stretch">
        {/* Первый ряд: отметка посещаемости */}
        <Grid item xs={12} md={8} display="flex">
          <Paper ref={attendanceRef} elevation={2} sx={{ borderRadius: 12, p: 3, flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <EventAvailableIcon sx={{ color: '#757575' }} />
              <Typography variant="h6" fontWeight={600}>Отметка посещаемости</Typography>
            </Stack>
            <Stack direction="row" spacing={1} mb={2}>
              {weekDays.map((d, i) => (
                <Button key={d.key} variant={selectedDay === i ? 'contained' : 'outlined'} sx={{ minWidth: 48, bgcolor: selectedDay === i ? '#757575' : '#fff', color: selectedDay === i ? '#fff' : '#757575', borderColor: '#757575', fontWeight: 600, borderRadius: 12, textTransform: 'none' }} onClick={() => setSelectedDay(i)}>{d.label}</Button>
              ))}
            </Stack>
            <Typography fontWeight={600} fontSize={16} mb={2}>{scheduleData[selectedDay].full}</Typography>
            <Stack spacing={2}>
              {scheduleData[selectedDay].lessons.map((lesson, lessonIdx) => (
                <Paper key={lesson.time} elevation={1} sx={{ p: 2, borderRadius: 12, display: 'flex', flexDirection: 'column', bgcolor: '#fafbfc', boxShadow: 'none', border: '1px solid #eaeaea' }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box minWidth={60}>
                      <Typography fontSize={14} color="#757575">{lesson.time}</Typography>
                      <Typography fontSize={14} color="#757575">{lesson.end}</Typography>
                    </Box>
                    <Box flex={1}>
                      <Typography fontWeight={500} fontSize={15}>{lesson.subject}</Typography>
                      <Typography fontSize={13} color="#757575" mt={0.5}>Ауд. {lesson.room} / Преп. {lesson.teacher}</Typography>
                    </Box>
                    <Box>
                      <Button size="small" variant="outlined" sx={{ borderColor: '#757575', color: '#757575', fontWeight: 500, borderRadius: 12, px: 3, textTransform: 'none', mt: 1 }} onClick={() => handleOpenMark(selectedDay, lessonIdx)}>
                        Отметить посещаемость
                      </Button>
                    </Box>
                    <Box ml={2}>
                      <Typography variant="caption" sx={{ bgcolor: lesson.type === 'Лекция' ? '#eaeaea' : '#f5f5f5', color: '#757575', borderRadius: 2, px: 1.5, py: 0.5, fontSize: 13, fontWeight: 500 }}>{lesson.type}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} display="flex">
          <Paper elevation={2} sx={{ borderRadius: 12, p: 3, flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box', minHeight: attendanceCardHeight, justifyContent: 'center', alignItems: 'center' }}>
            <Box mt={3} width="100%">
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Typography variant="h6" fontWeight={600}>Статистика</Typography>
                <Box ml="auto">
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label="Личная"
                      onClick={() => setStatsView('personal')}
                      sx={{
                        bgcolor: statsView === 'personal' ? '#111' : '#f5f5f5',
                        color: statsView === 'personal' ? '#fff' : '#111',
                        fontWeight: 500,
                        '&:hover': { bgcolor: statsView === 'personal' ? '#111' : '#eee' }
                      }}
                    />
                    <Chip
                      label="Группа"
                      onClick={() => setStatsView('group')}
                      sx={{
                        bgcolor: statsView === 'group' ? '#111' : '#f5f5f5',
                        color: statsView === 'group' ? '#fff' : '#111',
                        fontWeight: 500,
                        '&:hover': { bgcolor: statsView === 'group' ? '#111' : '#eee' }
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
              <Stack direction="row" spacing={3} mb={2}>
                <Stack>
                  <Typography color="#111" fontSize={15}>Посещено</Typography>
                  <Typography fontWeight={600} fontSize={18}>{statsView === 'personal' ? personalStatsData.attended : groupStatsData.attended}</Typography>
                </Stack>
                <Stack>
                  <Typography color="#111" fontSize={15}>Пропущено</Typography>
                  <Typography fontWeight={600} fontSize={18}>{statsView === 'personal' ? personalStatsData.missed : groupStatsData.missed}</Typography>
                </Stack>
                <Stack>
                  <Typography color="#111" fontSize={15}>Процент</Typography>
                  <Typography fontWeight={600} fontSize={18}>{statsView === 'personal' ? personalStatsData.percent : groupStatsData.percent}%</Typography>
                </Stack>
              </Stack>
              <Box>
                <LinearProgress variant="determinate" value={statsView === 'personal' ? personalStatsData.percent : groupStatsData.percent} sx={{ height: 12, borderRadius: 6, bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: '#4caf50' } }} />
              </Box>
            </Box>
          </Paper>
        </Grid>
        {/* Второй ряд: история и пропуски */}
        <Grid item xs={12} md={6} display="flex">
          <Paper elevation={2} sx={{ borderRadius: 12, p: 3, flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <HistoryIcon sx={{ color: '#111' }} />
              <Typography variant="h6" fontWeight={600}>История посещаемости</Typography>
              <Box ml="auto">
                <Stack direction="row" spacing={1}>
                  <Chip
                    label="Личная"
                    onClick={() => setHistoryView('personal')}
                    sx={{
                      bgcolor: historyView === 'personal' ? '#111' : '#f5f5f5',
                      color: historyView === 'personal' ? '#fff' : '#111',
                      fontWeight: 500,
                      '&:hover': { bgcolor: historyView === 'personal' ? '#111' : '#eee' }
                    }}
                  />
                  <Chip
                    label="Группа"
                    onClick={() => setHistoryView('group')}
                    sx={{
                      bgcolor: historyView === 'group' ? '#111' : '#f5f5f5',
                      color: historyView === 'group' ? '#fff' : '#111',
                      fontWeight: 500,
                      '&:hover': { bgcolor: historyView === 'group' ? '#111' : '#eee' }
                    }}
                  />
                </Stack>
              </Box>
            </Stack>
            <List dense sx={{ flexGrow: 1 }}>
              {history.length === 0 ? (
                <Typography color="text.secondary" align="center">Нет данных</Typography>
              ) : (
                history.map((h, i) => (
                  <ListItem key={i} disablePadding sx={{ mb: 1, alignItems: 'flex-start' }}>
                    <ListItemText
                      primary={<>
                        <Typography color="#111" fontSize={15}>{h.time}, {h.date}</Typography>
                        <Typography color="#111" fontSize={15}>{h.subject}</Typography>
                        <Typography variant="body2" color="text.secondary" fontSize={13}>{h.student}</Typography>
                      </>}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} display="flex">
          <Paper elevation={2} sx={{ borderRadius: 12, p: 3, flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <ReportProblemIcon sx={{ color: '#888' }} />
              <Typography variant="h6" fontWeight={600}>Пропуски и причины</Typography>
              <Box ml="auto">
                <Stack direction="row" spacing={1}>
                  <Chip
                    label="Личная"
                    onClick={() => setAbsencesView('personal')}
                    sx={{
                      bgcolor: absencesView === 'personal' ? '#111' : '#f5f5f5',
                      color: absencesView === 'personal' ? '#fff' : '#111',
                      fontWeight: 500,
                      '&:hover': { bgcolor: absencesView === 'personal' ? '#111' : '#eee' }
                    }}
                  />
                  <Chip
                    label="Группа"
                    onClick={() => setAbsencesView('group')}
                    sx={{
                      bgcolor: absencesView === 'group' ? '#111' : '#f5f5f5',
                      color: absencesView === 'group' ? '#fff' : '#111',
                      fontWeight: 500,
                      '&:hover': { bgcolor: absencesView === 'group' ? '#111' : '#eee' }
                    }}
                  />
                </Stack>
              </Box>
            </Stack>
            <List dense sx={{ flexGrow: 1 }}>
              {absences.length === 0 ? (
                <Typography color="text.secondary" align="center">Нет пропусков</Typography>
              ) : (
                absences.map((a, i) => (
                  <ListItem key={i} disablePadding sx={{ mb: 1, alignItems: 'flex-start' }}>
                    <ListItemText
                      primary={<>
                        <Typography color="#111" fontSize={15}>{a.time}, {a.date}</Typography>
                        <Typography color="#111" fontSize={15}>{a.subject}</Typography>
                        <Typography variant="body2" color="text.secondary" fontSize={13}>{a.student}</Typography>
                      </>}
                      secondary={<>
                        <Typography color="text.secondary" fontSize={13}>{a.reason}</Typography>
                        {a.accepted && (
                          <Stack direction="row" spacing={1} mt={0.5}>
                            <Chip
                              label="Причина отмечена"
                              color="success"
                              sx={{ fontWeight: 500, fontSize: 13, bgcolor: '#e8f5e9', color: '#388e3c' }}
                            />
                          </Stack>
                        )}
                      </>}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
      <AttendanceMarkModal
        open={modal.open}
        students={marking}
        lesson={modalLesson}
        onToggle={handleToggleStudent}
        onClose={handleCloseMark}
        onSave={handleSaveMark}
      />
    </Box>
  );
}