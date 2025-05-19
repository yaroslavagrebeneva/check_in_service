import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack } from '@mui/material';

export default function VisitDetailsModal({ open, onClose, visit }) {
  if (!visit) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Детали посещения</DialogTitle>
      <DialogContent>
        <Stack spacing={1} mt={1}>
          <Typography><b>Дата:</b> {visit.date}</Typography>
          <Typography><b>Время:</b> {visit.time}</Typography>
          <Typography><b>Предмет:</b> {visit.subject}</Typography>
          <Typography><b>Преподаватель:</b> {visit.teacher}</Typography>
          {visit.status && <Typography><b>Статус:</b> {visit.status}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
} 