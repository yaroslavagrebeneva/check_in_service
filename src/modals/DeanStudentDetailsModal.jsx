import { Dialog, DialogContent, DialogTitle, Typography, Box, Button, Stack, Alert } from '@mui/material';
import { useState } from 'react';
import { deanStudentDetailsMock } from '../mocks/deanStudentDetailsMock';

export default function DeanStudentDetailsModal({ open, student, onClose }) {
  const [notified, setNotified] = useState(false);
  // Используем мок-данные, если student не передан
  const data = student || deanStudentDetailsMock;

  const handleNotify = () => {
    setNotified(true);
    setTimeout(() => setNotified(false), 2500);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 0, bgcolor: '#fff', fontFamily: 'Inter, Arial, sans-serif' } }}>
      <DialogTitle sx={{ fontFamily: 'Inter, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#111', pb: 0 }}>
        {data.name}
      </DialogTitle>
      <DialogContent sx={{ fontFamily: 'Inter, Arial, sans-serif', color: '#111', pt: 1 }}>
        <Stack spacing={1.2} mb={2}>
          <Typography fontSize={15}><b>Факультет:</b> {data.faculty || '-'}</Typography>
          <Typography fontSize={15}><b>Кафедра:</b> {data.department || '-'}</Typography>
          <Typography fontSize={15}><b>Направление:</b> {data.speciality || '-'}</Typography>
          <Typography fontSize={15}><b>Курс:</b> {data.course || '-'}</Typography>
          <Typography fontSize={15}><b>Пропущено за месяц:</b> {data.missedMonth ?? '-'}</Typography>
          <Typography fontSize={15}><b>По уважительной:</b> {data.missedRespectful ?? '-'}</Typography>
          <Typography fontSize={15}><b>По другим причинам:</b> {data.missedOther ?? '-'}</Typography>
        </Stack>
        {notified && (
          <Alert severity="success" sx={{ mb: 2, fontSize: 15, borderRadius: 2 }}>Вызов в деканат отправлен</Alert>
        )}
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            sx={{ borderRadius: 999, bgcolor: '#bbb', color: '#111', fontWeight: 500, fontSize: 16, px: 4, minHeight: 40, boxShadow: 'none', textTransform: 'none', '&:hover': { bgcolor: '#888' } }}
            onClick={handleNotify}
            disabled={notified}
          >
            Вызвать в деканат
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
} 