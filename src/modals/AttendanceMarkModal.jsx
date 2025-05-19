import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, IconButton, Box } from '@mui/material';

export default function AttendanceMarkModal({ open, students, lesson, onToggle, onClose, onSave }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 22, pb: 1, borderRadius: 4 }}>{lesson?.subject || 'Отметить посещаемость'}</DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        {lesson && (
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography fontWeight={600} fontSize={17}>{lesson.day}</Typography>
            <Typography fontSize={15} color="#757575">{lesson.time}–{lesson.end}</Typography>
          </Stack>
        )}
        <Box sx={{ borderRadius: 3, bgcolor: '#fafbfc', p: 2, mb: 1 }}>
          <Stack spacing={1.5}>
            {students.map((student, idx) => (
              <Stack key={student.name} direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 180, fontSize: 16, fontWeight: 500 }}>{student.name}</Typography>
                <IconButton onClick={() => onToggle(idx)}>
                  {student.status === 'П' ? (
                    <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #4caf50' }}>
                      <Typography fontWeight={700} fontSize={20} sx={{ color: '#388e3c' }}>П</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #f44336' }}>
                      <Typography fontWeight={700} fontSize={20} sx={{ color: '#c62828' }}>Н</Typography>
                    </Box>
                  )}
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ bgcolor: '#eaeaea', color: '#757575', boxShadow: 'none', borderRadius: 2, '&:hover': { bgcolor: '#e0e0e0' } }}>Отмена</Button>
        <Button onClick={onSave} variant="contained" sx={{ bgcolor: '#111', color: '#fff', borderRadius: 2 }}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
} 