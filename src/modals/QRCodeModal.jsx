import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';

export default function QRCodeModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Сканировать QR-код</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={120}>
          <QrCode2Icon sx={{ fontSize: 60, color: '#111', mb: 2 }} />
          <Typography color="text.secondary">Функция сканирования QR-кода будет доступна в мобильном приложении</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ bgcolor: '#eaeaea', color: '#757575', boxShadow: 'none', '&:hover': { bgcolor: '#e0e0e0' } }}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
} 