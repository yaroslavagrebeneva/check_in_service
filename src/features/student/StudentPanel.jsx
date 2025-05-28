import { Box, Paper, Typography, Button, Stack, List, ListItem, ListItemText, Grid, Chip, LinearProgress } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { useState } from 'react';
import AbsenceReasonModal from '../../modals/AbsenceReasonModal';
import { StudentVisitModal } from '../../modals/StudentVisitModal';
import QRCodeModal from '../../modals/QRCodeModal';
import { mockHistory, mockAbsences } from '../../mocks/studentMocks';

export default function StudentPanel() {
  const [absences, setAbsences] = useState(mockAbsences);
  const [openReasonIdx, setOpenReasonIdx] = useState(null);
  const [openVisitIdx, setOpenVisitIdx] = useState(null);
  const [openQR, setOpenQR] = useState(false);

  const handleOpenReason = idx => setOpenReasonIdx(idx);
  const handleCloseReason = () => setOpenReasonIdx(null);
  const handleSaveReason = data => {
    setAbsences(absences => absences.map((a, i) =>
      i === openReasonIdx ? { ...a, ...data, reason: data.type === 'illness' ? 'Болезнь' : data.type === 'valid' ? 'Уважительная' : data.desc || 'Другое' } : a
    ));
    handleCloseReason();
  };

  return (
    <Box maxWidth={1300} mx="auto" mt={4}>
      <Grid container spacing={3} alignItems="stretch">
        {/* История посещаемости */}
        <Grid item xs={12} md={5} display="flex">
          <Paper elevation={2} sx={{ borderRadius: 12, p: 3, flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <HistoryIcon sx={{ color: '#111' }} />
              <Typography variant="h6" fontWeight={600}>История посещаемости</Typography>
            </Stack>
            <List dense sx={{ flexGrow: 1 }}>
              {mockHistory.map((h, i) => (
                <ListItem key={i} disablePadding sx={{ mb: 1, alignItems: 'flex-start' }}>
                  <ListItemText
                    primary={<>
                      <Typography color="#111" fontSize={15}>{h.time}, {h.date}</Typography>
                      <Typography color="#111" fontSize={15}>{h.subject}</Typography>
                      <Typography variant="body2" color="text.secondary" fontSize={13}>{h.teacher}</Typography>
                    </>}
                  />
                </ListItem>
              ))}
            </List>
            <Box textAlign="right" mt={1}>
              <Button size="small" variant="contained" sx={{ bgcolor: '#111', color: '#fff', px: 3, borderRadius: 2, fontWeight: 400, fontSize: 14, textTransform: 'none' }} onClick={() => setOpenVisitIdx(0)}>
                Подробнее
              </Button>
            </Box>
          </Paper>
        </Grid>
        {/* Пропуски */}
        <Grid item xs={12} md={5} display="flex">
          <Paper elevation={2} sx={{ borderRadius: 12, p: 3, flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <ReportProblemIcon sx={{ color: '#888' }} />
              <Typography variant="h6" fontWeight={600}>Пропуски</Typography>
            </Stack>
            <List dense sx={{ flexGrow: 1 }}>
              {absences.map((a, i) => {
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
                  <Button size="small" variant="contained" sx={{ bgcolor: '#111', color: '#fff', borderRadius: 2, fontWeight: 400, fontSize: 14, textTransform: 'none', mt: 1 }} onClick={() => handleOpenReason(i)}>
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
              })}
            </List>
          </Paper>
        </Grid>
        {/* Статистика и QR-код */}
        <Grid item xs={12} md={2} display="flex" flexDirection="column">
          <Stack spacing={3} sx={{ height: '100%', minHeight: 340 }} justifyContent="space-between">
            <Paper elevation={2} sx={{ borderRadius: 12, p: 3, flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box', mb: 2, minHeight: 140, justifyContent: 'center' }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Статистика посещаемости
              </Typography>
              {(() => {
                const total = 30;
                const attended = 25;
                const missed = 5;
                const percent = Math.round((attended / total) * 100);
                return (
                  <>
                    <Stack direction="row" spacing={3} mb={2}>
                      <Stack>
                        <Typography color="#111" fontSize={15}>Посещено</Typography>
                        <Typography fontWeight={600} fontSize={18}>{attended}</Typography>
                      </Stack>
                      <Stack>
                        <Typography color="#111" fontSize={15}>Пропущено</Typography>
                        <Typography fontWeight={600} fontSize={18}>{missed}</Typography>
                      </Stack>
                      <Stack>
                        <Typography color="#111" fontSize={15}>Процент</Typography>
                        <Typography fontWeight={600} fontSize={18}>{percent}%</Typography>
                      </Stack>
                    </Stack>
                    <Box>
                      <LinearProgress variant="determinate" value={percent} sx={{ height: 12, borderRadius: 6, bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: percent > 80 ? '#4caf50' : percent > 60 ? '#ffc107' : '#f44336' } }} />
                    </Box>
                  </>
                );
              })()}
            </Paper>
            <Paper elevation={2} sx={{ borderRadius: 12, p: 3, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', minHeight: 140 }}>
              <Stack direction="column" alignItems="center" spacing={2} mb={2}>
                <QrCode2Icon sx={{ color: '#111', fontSize: 80 }} />
                <Typography fontWeight={500} fontSize={20} align="center">Сканировать QR-код</Typography>
              </Stack>
              <Button size="medium" variant="contained" sx={{ bgcolor: '#111', color: '#fff', borderRadius: 2, fontWeight: 400, fontSize: 16, minWidth: 120, textTransform: 'none', boxShadow: 2, display: 'block', mx: 'auto' }} onClick={() => setOpenQR(true)}>
                Сканировать
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
      {/* Модальные окна */}
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
        visit={mockHistory[openVisitIdx]}
      />
      <QRCodeModal open={openQR} onClose={() => setOpenQR(false)} />
    </Box>
  );
}