import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack, Typography } from '@mui/material';
import { useState } from 'react';

const reasonTypes = [
  { value: 'illness', label: 'Болезнь' },
  { value: 'valid', label: 'Уважительная' },
  { value: 'other', label: 'Другое' },
];

export default function AbsenceReasonModal({ open, onClose, onSave, initialType = '', initialDesc = '', initialFile = null }) {
  const [type, setType] = useState(initialType);
  const [desc, setDesc] = useState(initialDesc);
  const [file, setFile] = useState(initialFile);

  const handleFileChange = e => setFile(e.target.files[0]);
  const handleSave = () => {
    onSave({ type, desc, file });
    setType(''); setDesc(''); setFile(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Указать причину отсутствия</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Тип причины"
          value={type}
          onChange={e => setType(e.target.value)}
          fullWidth
          margin="normal"
        >
          {reasonTypes.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </TextField>
        {(type === 'valid' || type === 'other') && (
          <TextField
            label="Описание"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            minRows={2}
          />
        )}
        {type === 'illness' && (
          <Stack spacing={1} mt={1}>
            <Typography variant="body2" color="text.secondary">Прикрепите справку</Typography>
            <Button variant="outlined" component="label" sx={{ color: '#757575', borderColor: '#eaeaea', bgcolor: '#fff', '&:hover': { bgcolor: '#eaeaea', borderColor: '#eaeaea' } }}>
              Загрузить файл
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {file && <Typography fontSize={13}>{file.name}</Typography>}
          </Stack>
        )}
        {type === 'valid' && (
          <Stack spacing={1} mt={1}>
            <Typography variant="body2" color="text.secondary">Прикрепите подтверждающий файл (если есть)</Typography>
            <Button variant="outlined" component="label" sx={{ color: '#757575', borderColor: '#eaeaea', bgcolor: '#fff', '&:hover': { bgcolor: '#eaeaea', borderColor: '#eaeaea' } }}>
              Загрузить файл
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {file && <Typography fontSize={13}>{file.name}</Typography>}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ bgcolor: '#eaeaea', color: '#757575', boxShadow: 'none', '&:hover': { bgcolor: '#e0e0e0' } }}>Отмена</Button>
        <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#111', color: '#fff' }}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
} 