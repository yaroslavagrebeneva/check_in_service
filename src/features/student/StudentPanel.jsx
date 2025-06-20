import { Box, Paper, Typography, Button, Stack, List, ListItem, ListItemText, Grid, Chip, LinearProgress } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useState, useEffect } from 'react';
import AbsenceReasonModal from '../../modals/AbsenceReasonModal';
import { StudentVisitModal } from '../../modals/StudentVisitModal';
import axios from 'axios';
import { API_BASE_URL } from '../../app/config';

export default function StudentPanel({ userId }) {
  const [absences, setAbsences] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ total: 0, attended: 0, missed: 0, percent: 0 });
  const [openReasonIdx, setOpenReasonIdx] = useState(null);
  const [openVisitIdx, setOpenVisitIdx] = useState(null);
  const [loading, setLoading] = useState(true);

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer dummy-token`,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.error('userId is undefined, cannot fetch data');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Загрузка истории
        const historyResponse = await axiosInstance.get(`/attendances/history?user_id=${userId}&limit=10`);
        console.log('Raw History data:', historyResponse.data);
        setHistory(historyResponse.data.map(item => ({
          id: item.id,
          time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(item.created_at).toLocaleDateString(),
          subject: item.lessonid || 'Предмет',
          teacher: 'Преподаватель',
          status: item.attendance ? 'П' : 'О',
        })));

        // Загрузка пропусков
        const absencesResponse = await axiosInstance.get(`/attendances/?user_id=${userId}&limit=10&start_date=2025-06-01&end_date=2025-06-20`);
        console.log('Raw Absences data:', absencesResponse.data);
        setAbsences(absencesResponse.data
          .filter(a => !a.attendance)
          .map(item => ({
            time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date(item.created_at).toLocaleDateString(),
            subject: item.lessonid || 'Предмет',
            teacher: 'Преподаватель',
            reason: item.reason_id ? (item.reason?.status === 'CONFIRMED' ? 'Причина отмечена' : 'Ожидает подтверждения') : 'Не указана',
            accepted: item.reason?.status === 'CONFIRMED',
            type: item.reason?.reason_name || '',
            desc: item.reason?.comment || '',
            file: item.reason?.doc_url || null,
          })));

        // Загрузка статистики
        const statsResponse = await axiosInstance.get(`/attendances/stats?user_id=${userId}&start_date=2025-06-01&end_date=2025-06-20`);
        console.log('Raw Stats data:', statsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleOpenReason = (idx) => setOpenReasonIdx(idx);
  const handleCloseReason = () => setOpenReasonIdx(null);
  const handleSaveReason = async (data) => {
    try {
      const reasonData = {
        reason_name: data.type,
        status: 'PENDING',
        comment: data.desc,
        doc_url: data.file || null,
      };
      const reasonResponse = await axiosInstance.post('/reasons/', reasonData);
      const attendanceData = {
        user_id: userId,
        attendance: false,
        validation_type: 'MANUAL',
        lessonid: 'lesson123',
        reason_id: reasonResponse.data.id,
      };
      await axiosInstance.post('/attendances/', attendanceData);
      setAbsences(absences.map((a, i) => i === openReasonIdx ? { ...a, ...data, reason: data.type === 'ILLNESS' ? 'Болезнь' : data.type === 'GOOD_REASON' ? 'Уважительная' : data.desc || 'Другое' } : a));
    } catch (error) {
      console.error('Ошибка сохранения причины:', error);
    }
    handleCloseReason();
  };

  if (loading) return <LinearProgress />;

  return (
    <Box maxWidth={1300} mx="auto" mt={4}>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={4} display="flex">
          <Paper elevation={2} sx={{ borderRadius: 12, p: 3, flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <HistoryIcon sx={{ color: '#111' }} />
              <Typography variant="h6" fontWeight={600}>История посещаемости</Typography>
            </Stack>
            <List dense sx={{ flexGrow: 1 }}>
              {history.length === 0 ? (
                <Typography color="text.secondary" align="center">Нет данных</Typography>
              ) : (
                history.map((h, i) => (
                  <ListItem key={h.id} disablePadding sx={{ mb: 1, alignItems: 'flex-start' }}>
                    <ListItemText
                      primary={<>
                        <Typography color="#111" fontSize={15}>{h.time}, {h.date}</Typography>
                        <Typography color="#111" fontSize={15}>{h.subject}</Typography>
                        <Typography variant="body2" color="text.secondary" fontSize={13}>{h.teacher}</Typography>
                      </>}
                    />
                  </ListItem>
                ))
              )}
            </List>
            <Box textAlign="right" mt={1}>
              <Button
                size="small"
                variant="contained"
                sx={{ bgcolor: '#111', color: '#fff', px: 3, borderRadius: 2, fontWeight: 400, fontSize: 14, textTransform: 'none' }}
                onClick={() => setOpenVisitIdx(0)}
                disabled={!history.length}
              >
                Подробнее
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} display="flex">
          <Paper elevation={2} sx={{ borderRadius: 12, p: 3, flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <ReportProblemIcon sx={{ color: '#888' }} />
              <Typography variant="h6" fontWeight={600}>Пропуски</Typography>
            </Stack>
            <List dense sx={{ flexGrow: 1 }}>
              {absences.length === 0 ? (
                <Typography color="text.secondary" align="center">Нет пропусков</Typography>
              ) : (
                absences.map((a, i) => {
                  const showChip = a.reason && a.reason !== 'Не указана';
                  const chip = showChip ? (
                    <Stack direction="row" spacing={1} mt={0.5}>
                      <Chip
                        label={a.accepted ? 'Причина отмечена' : 'Ожидает подтверждения'}
                        color={a.accepted ? 'success' : 'default'}
                        sx={{ fontWeight: 500, fontSize: 13, bgcolor: a.accepted ? '#e8f5e9' : undefined, color: a.accepted ? '#388e3c' : undefined }}
                      />
                    </Stack>
                  ) : null;
                  const reasonButton = !showChip && (
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ bgcolor: '#111', color: '#fff', borderRadius: 2, fontWeight: 400, fontSize: 14, textTransform: 'none', mt: 1 }}
                      onClick={() => handleOpenReason(i)}
                    >
                      Отметить причину
                    </Button>
                  );
                  return (
                    <ListItem key={i} disablePadding sx={{ mb: 1, alignItems: 'flex-start' }}>
                      <ListItemText
                        primary={<>
                          <Typography color="#111" fontSize={15}>{a.time}, {a.date}</Typography>
                          <Typography color="#111" fontSize={15}>{a.subject}</Typography>
                          <Typography variant="body2" color="text.secondary" fontSize={13}>{a.teacher}</Typography>
                        </>}
                        secondary={<>
                          <Typography color="text.secondary" fontSize={13}>{a.reason}</Typography>
                          {chip}
                          {reasonButton}
                        </>}
                      />
                    </ListItem>
                  );
                })
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} display="flex">
          <Paper elevation={2} sx={{ borderRadius: 12, p: 3, flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box', mb: 2, minHeight: 140, justifyContent: 'center' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Статистика посещаемости
            </Typography>
            <Stack direction="row" spacing={3} mb={2}>
              <Stack>
                <Typography color="#111" fontSize={15}>Посещено</Typography>
                <Typography fontWeight={600} fontSize={18}>{stats.attended}</Typography>
              </Stack>
              <Stack>
                <Typography color="#111" fontSize={15}>Пропущено</Typography>
                <Typography fontWeight={600} fontSize={18}>{stats.missed}</Typography>
              </Stack>
              <Stack>
                <Typography color="#111" fontSize={15}>Процент</Typography>
                <Typography fontWeight={600} fontSize={18}>{stats.percent}%</Typography>
              </Stack>
            </Stack>
            <Box>
              <LinearProgress
                variant="determinate"
                value={stats.percent}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  bgcolor: '#eee',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: stats.percent > 80 ? '#4caf50' : stats.percent > 60 ? '#ffc107' : '#f44336',
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <AbsenceReasonModal
        open={openReasonIdx !== null}
        onClose={handleCloseReason}
        onSave={handleSaveReason}
        initialType={absences[openReasonIdx]?.type || ''}
        initialDesc={absences[openReasonIdx]?.desc || ''}
        initialFile={absences[openReasonIdx]?.file || null}
      />
      <StudentVisitModal
        open={openVisitIdx !== null}
        onClose={() => setOpenVisitIdx(null)}
        visit={history[openVisitIdx] || {}}
      />
    </Box>
  );
}