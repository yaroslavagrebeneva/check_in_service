import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Chip } from '@mui/material';

export function StudentVisitModal({ open, onClose, visit }) {
  if (!visit) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Подробности посещения</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography fontWeight={500} fontSize={16}>Предмет: {visit.subject}</Typography>
          <Typography fontSize={15}>Время: {visit.time}</Typography>
          <Typography fontSize={15}>Дата: {visit.date}</Typography>
          <Typography fontSize={15}>Преподаватель: {visit.teacher}</Typography>
          <Chip
            label={visit.status === 'П' ? 'Присутствовал' : 'Отсутствовал'}
            sx={{
              fontWeight: 500,
              bgcolor: visit.status === 'П' ? 'rgba(76,175,80,0.10)' : 'rgba(211,47,47,0.10)',
              color: visit.status === 'П' ? '#388e3c' : '#d32f2f',
              border: visit.status === 'П' ? '1.5px solid #388e3c' : '1.5px solid #d32f2f',
              borderRadius: 2,
              fontSize: 13,
              minHeight: 28
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
}