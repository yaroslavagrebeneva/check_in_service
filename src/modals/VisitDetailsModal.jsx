function VisitDetailsModal({ open, onClose, lesson }) {
  const [filter, setFilter] = useState('all');
  const [students, setStudents] = useState(lesson?.students || []);
  const [editModal, setEditModal] = useState({ open: false, student: null, idx: null });

  useEffect(() => {
    setStudents(lesson?.students || []);
    setFilter('all');
  }, [lesson, open]);

  const filtered = filter === 'all'
    ? students.slice().sort((a, b) => a.name.localeCompare(b.name))
    : filter === 'absent'
      ? students.filter(s => s.status === 'Н').slice().sort((a, b) => a.name.localeCompare(b.name))
      : students.slice().sort((a, b) => a.name.localeCompare(b.name));

  const handleRemoveStudent = idx => {
    setStudents(prev =>
      prev.map((student, i) =>
        i === idx ? { ...student, status: 'Н', markType: 'manual' } : student
      )
    );
  };

  const handleEditStatus = (idx, newStatus) => {
    setStudents(prev =>
      prev.map((student, i) =>
        i === idx ? { ...student, status: newStatus, markType: 'manual' } : student
      )
    );
    setEditModal({ open: false, student: null, idx: null });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Посещение: {lesson?.subject} ({lesson?.group})</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={1} mb={2} mt={1}>
          <Chip
            label="Все"
            clickable
            onClick={() => setFilter('all')}
            sx={{
              bgcolor: filter === 'all' ? 'rgba(17,17,17,0.9)' : 'rgba(245,245,245,0.9)',
              color: filter === 'all' ? '#fff' : '#111',
              fontWeight: 500,
              borderRadius: 2,
              fontSize: 14,
              minHeight: 28
            }}
          />
          <Chip
            label="Только отсутствующие"
            clickable
            onClick={() => setFilter('absent')}
            sx={{
              bgcolor: filter === 'absent' ? 'rgba(17,17,17,0.9)' : 'rgba(245,245,245,0.9)',
              color: filter === 'absent' ? '#fff' : '#111',
              fontWeight: 500,
              borderRadius: 2,
              fontSize: 14,
              minHeight: 28
            }}
          />
          <Chip
            label="Способ отметки"
            clickable
            onClick={() => setFilter('markType')}
            sx={{
              bgcolor: filter === 'markType' ? 'rgba(17,17,17,0.9)' : 'rgba(245,245,245,0.9)',
              color: filter === 'markType' ? '#fff' : '#111',
              fontWeight: 500,
              borderRadius: 2,
              fontSize: 14,
              minHeight: 28
            }}
          />
        </Stack>
        <Stack spacing={1.5}>
          {filtered.map((s, idx) => (
            <Paper
              key={s.name}
              sx={{
                p: 1.5,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#fafbfc',
                border: '1px solid #eaeaea'
              }}
            >
              {filter === 'markType' ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <Typography fontWeight={500} fontSize={14}>{s.name}</Typography>
                  <Typography fontSize={13} color="#757575">Группа: {lesson?.group}</Typography>
                  <Typography fontSize={13} color="#757575">Предмет: {lesson?.subject}</Typography>
                  <Typography fontSize={13} color="#757575">Время: {lesson?.time}–{lesson?.end}</Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip
                      label={s.status === 'П' ? 'Присутствует' : 'Отсутствует'}
                      sx={{
                        fontWeight: 500,
                        bgcolor: s.status === 'П' ? 'rgba(76,175,80,0.10)' : 'rgba(211,47,47,0.10)',
                        color: s.status === 'П' ? '#388e3c' : '#d32f2f',
                        border: s.status === 'П' ? '1.5px solid #388e3c' : '1.5px solid #d32f2f',
                        borderRadius: 2,
                        fontSize: 13,
                        minHeight: 28
                      }}
                    />
                    <Chip
                      label={s.markType === 'qr' ? 'QR-код' : 'Вручную'}
                      sx={{
                        fontWeight: 500,
                        bgcolor: s.markType === 'qr' ? 'rgba(76,175,80,0.10)' : 'rgba(189,189,189,0.10)',
                        color: s.markType === 'qr' ? '#388e3c' : '#757575',
                        border: s.markType === 'qr' ? '1.5px solid #388e3c' : '1.5px solid #bdbdbd',
                        borderRadius: 2,
                        fontSize: 13,
                        minHeight: 28
                      }}
                    />
                  </Stack>
                </Box>
              ) : (
                <>
                  <NameStatusChip name={s.name} status={s.status} />
                  <Typography fontSize={13} color="#757575" ml={2}>
                    {s.markType === 'qr' ? 'QR-код' : 'Вручную'}
                  </Typography>
                  <Box flex={1} />
                  {s.status === 'П' && s.markType === 'manual' && (
                    <Tooltip title="Удалить и отметить как отсутствующего">
                      <IconButton
                        size="small"
                        sx={{ color: '#d32f2f', ml: 0.5 }}
                        onClick={() => handleRemoveStudent(idx)}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {s.status === 'Н' && (
                    <Tooltip title="Редактировать статус">
                      <IconButton
                        size="small"
                        sx={{ color: '#1976d2', ml: 0.5 }}
                        onClick={() => setEditModal({ open: true, student: s, idx })}
                        disabled={s.markType !== 'manual'}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
            </Paper>
          ))}
          {filtered.length === 0 && <Typography color="#757575" fontSize={15}>Нет студентов</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Закрыть</Button>
      </DialogActions>
      <EditStatusModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, student: null, idx: null })}
        student={editModal.student}
        lesson={lesson}
        onConfirmAbsent={() => handleEditStatus(editModal.idx, 'Н')}
        onSetPresent={() => handleEditStatus(editModal.idx, 'П')}
      />
    </Dialog>
  );
}