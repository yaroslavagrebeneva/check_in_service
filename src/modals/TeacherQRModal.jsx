import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

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

export default function TeacherQRModal({ open, onClose }) {
  const code = useDynamicCode();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 600, textAlign: 'center' }}>QR-код</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={2}>
          <Box bgcolor="#fff" p={3} borderRadius={4} boxShadow={1}>
            <QRCode value={code} size={180} bgColor="#fff" fgColor="#111" />
          </Box>
          <Typography fontSize={14} color="#757575" mt={2}>QR-код обновляется каждую секунду</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2, bgcolor: '#111', color: '#fff', fontWeight: 500, px: 4 }}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
} 