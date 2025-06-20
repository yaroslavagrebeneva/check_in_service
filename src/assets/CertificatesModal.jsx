// CertificatesModal.jsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Chip, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';

function CertificatesModal({ open, onClose, student }) {
  if (!student || !student.certificates) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 600 }}>Справки студента: {student.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {student.certificates.length > 0 ? (
            student.certificates.map((cert, idx) => (
              <Paper
                key={idx}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: '#fafbfc',
                  border: '1px solid #eaeaea'
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    icon={<DescriptionIcon sx={{ color: '#1976d2', fontSize: 20 }} />}
                    label={`Тип: ${cert.reasonType || 'не указан'}`}
                    sx={{ bgcolor: 'rgba(25,118,210,0.08)', color: '#1976d2', border: '1.5px solid #1976d2', fontWeight: 500, borderRadius: 1.5, px: 2, fontSize: 15 }}
                  />
                  {cert.file && (
                    <Chip
                      icon={<AttachFileIcon sx={{ color: '#757575', fontSize: 20 }} />}
                      label={cert.file}
                      sx={{ bgcolor: 'rgba(117,117,117,0.08)', color: '#757575', border: '1.5px solid #757575', fontWeight: 500, borderRadius: 1.5, px: 2, fontSize: 15 }}
                      component="a"
                      href={cert.fileUrl || '#'}
                      target="_blank"
                      clickable
                    />
                  )}
                </Stack>
                {cert.desc && (
                  <Typography fontSize={15} color="#757575" mt={1}>Описание: {cert.desc}</Typography>
                )}
                <Typography fontSize={14} color="#757575" mt={1}>Дата: {cert.date}</Typography>
                <Typography fontSize={14} color="#757575">Предмет: {cert.subject}</Typography>
                <Typography fontSize={14} color="#757575">Группа: {cert.group}</Typography>
              </Paper>
            ))
          ) : (
            <Typography fontSize={15} color="#757575">Справки отсутствуют</Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CertificatesModal;