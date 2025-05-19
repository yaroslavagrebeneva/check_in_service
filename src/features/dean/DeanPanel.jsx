import { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Stack, Chip, Button, MenuItem, Select, FormControl, InputLabel, LinearProgress, Dialog, DialogContent, DialogActions } from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { deanStats, deanCriticalStudents, deanAttendanceReports } from '../../mocks/deanReportMocks';
import DeanStudentDetailsModal from '../../modals/DeanStudentDetailsModal';
import { deanStudentDetailsMock } from '../../mocks/deanStudentDetailsMock';
import '../dean/fonts/TimesNewRoman-normal.js';

function generateDeanPDF(group, month, report, starosta, curator) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  doc.setFont('times', 'normal');
  doc.setFontSize(14);
  const monthNames = {
    '01': 'Январь', '02': 'Февраль', '03': 'Март', '04': 'Апрель',
    '05': 'Май', '06': 'Июнь', '07': 'Июль', '08': 'Август',
    '09': 'Сентябрь', '10': 'Октябрь', '11': 'Ноябрь', '12': 'Декабрь'
  };
  const [year, monthNum] = month.split('-');
  const monthName = monthNames[monthNum];

  // Заголовок по центру
  doc.text('Отчет по посещаемости', 105, 15, { align: 'center' });

  doc.setFontSize(12);
  const leftX = 10;
  const rightX = 200;
  let y = 25;
  doc.text(`Месяц: ${monthName} ${year}`, leftX, y);
  doc.line(leftX, y + 1, rightX, y + 1);
  y += 7;
  doc.text(`Группа: ${group}`, leftX, y);
  doc.line(leftX, y + 1, rightX, y + 1);
  y += 7;
  doc.text(`Общее количество проведённых занятий в месяц: ${report.total || ''}`, leftX, y);
  doc.line(leftX, y + 1, rightX, y + 1);

  // Таблица
  const tableHead = [[
    'ФИО обучающегося',
    'Общее количество пропущенных занятий',
    'Количество пропущенных занятий по уважительной причине'
  ]];

  const tableBody = report.details.map(student => {
    const totalMissed = student.status === 'Пропуск' ? 1 : 0;
    const respectfulMissed = (student.status === 'Пропуск' && student.reason && student.reason.type !== null) ? 1 : 0;
    return [
      student.name,
      totalMissed.toString(),
      respectfulMissed.toString()
    ];
  });

  while (tableBody.length < 20) {
    tableBody.push(['', '', '']);
  }

  autoTable(doc, {
    startY: y + 6,
    head: tableHead,
    body: tableBody,
    theme: 'plain',
    styles: { lineColor: [0,0,0], lineWidth: 0.1, fontSize: 12, font: 'times', halign: 'left', valign: 'middle' },
    headStyles: { fillColor: [255,255,255], textColor: [0,0,0], fontStyle: 'normal', lineWidth: 0.1, lineColor: [0,0,0], font: 'times', fontSize: 12 },
    tableLineColor: [0,0,0],
    tableLineWidth: 0.1,
    margin: { left: 10, right: 10 }
  });

  // Подписи и линии
  let finalY = doc.lastAutoTable.finalY || y + 20 * 7;
  const tableWidth = 190;
  const leftMargin = 10;
  const rightMargin = 200;
  const lineY1 = finalY + 15;
  const lineY2 = finalY + 25;

  doc.setFontSize(12);
  // ФИО старосты и подпись
  doc.text(`ФИО старосты: ${starosta || 'Не указан'}`, leftMargin, lineY1);
  doc.text('подпись', rightMargin - 30, lineY1, { align: 'right' });
  doc.line(leftMargin, lineY1 + 2, rightMargin, lineY1 + 2);

  // ФИО куратора и подпись
  doc.text(`ФИО куратора: ${curator || 'Не указан'}`, leftMargin, lineY2);
  doc.text('подпись', rightMargin - 30, lineY2, { align: 'right' });
  doc.line(leftMargin, lineY2 + 2, rightMargin, lineY2 + 2);

  return doc;
}

export default function DeanPanel() {
  const [group, setGroup] = useState('И-21');
  const [month, setMonth] = useState('2024-06');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const pdfBlobUrlRef = useRef(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStatsGroup, setSelectedStatsGroup] = useState(Object.keys(deanAttendanceReports)[0]);
  const statsGroups = Object.keys(deanAttendanceReports);
  const groupReport = deanAttendanceReports[group]?.[month] || {};
  const total = groupReport.total || 0;
  const present = groupReport.present || 0;
  const absent = groupReport.absent || 0;
  const percent = total ? Math.round((present / total) * 100) : 0;

  const handleDownloadPDF = () => {
    const report = deanAttendanceReports[group]?.[month];
    if (!report) return;
    setPdfLoading(true);
    setTimeout(() => {
      const doc = generateDeanPDF(group, month, report, report.starosta, report.curator);
      const monthNames = {
        '01': 'Январь', '02': 'Февраль', '03': 'Март', '04': 'Апрель',
        '05': 'Май', '06': 'Июнь', '07': 'Июль', '08': 'Август',
        '09': 'Сентябрь', '10': 'Октябрь', '11': 'Ноябрь', '12': 'Декабрь'
      };
      const [year, monthNum] = month.split('-');
      const monthName = monthNames[monthNum];
      doc.save(`Отчет_по_посещаемости_${group}_${monthName}_${year}.pdf`);
      setPdfLoading(false);
    }, 500);
  };

  const handlePreviewPDF = () => {
    const report = deanAttendanceReports[group]?.[month];
    if (!report) return;
    setPdfLoading(true);
    setTimeout(() => {
      const doc = generateDeanPDF(group, month, report, report.starosta, report.curator);
      const pdfBlob = doc.output('blob');
      if (pdfBlobUrlRef.current) {
        URL.revokeObjectURL(pdfBlobUrlRef.current);
      }
      const url = URL.createObjectURL(pdfBlob);
      pdfBlobUrlRef.current = url;
      setPdfPreviewUrl(url);
      setPreviewOpen(true);
      setPdfLoading(false);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (pdfBlobUrlRef.current) {
        URL.revokeObjectURL(pdfBlobUrlRef.current);
      }
    };
  }, []);

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPdfPreviewUrl(null);
  };

  return (
    <Box maxWidth={1200} mx="auto" mt={4}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={3}>
        {/* Статистика по кафедре и группам */}
        <Paper elevation={2} sx={{ borderRadius: 12, p: 4, flex: 1, minWidth: 320 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>Статистика</Typography>
          <Typography fontSize={15} color="#888" mb={1}>Кафедра прикладной информатики</Typography>
          <Stack direction="row" spacing={1} mb={2}>
            {statsGroups.map(g => (
              <Chip
                key={g}
                label={g}
                onClick={() => setSelectedStatsGroup(g)}
                sx={{
                  bgcolor: selectedStatsGroup === g ? '#111' : '#f5f5f5',
                  color: selectedStatsGroup === g ? '#fff' : '#111',
                  fontWeight: 500,
                  fontSize: 15,
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: selectedStatsGroup === g ? '#111' : '#eee' }
                }}
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={3} mb={2}>
            <Stack>
              <Typography color="#111" fontSize={15}>Всего</Typography>
              <Typography fontWeight={600} fontSize={18}>{deanAttendanceReports[selectedStatsGroup]?.[month]?.total || 0}</Typography>
            </Stack>
            <Stack>
              <Typography color="#111" fontSize={15}>Посещено</Typography>
              <Typography fontWeight={600} fontSize={18}>{deanAttendanceReports[selectedStatsGroup]?.[month]?.present || 0}</Typography>
            </Stack>
            <Stack>
              <Typography color="#111" fontSize={15}>Пропущено</Typography>
              <Typography fontWeight={600} fontSize={18}>{deanAttendanceReports[selectedStatsGroup]?.[month]?.absent || 0}</Typography>
            </Stack>
            <Stack>
              <Typography color="#111" fontSize={15}>Процент</Typography>
              <Typography fontWeight={600} fontSize={18}>
                {deanAttendanceReports[selectedStatsGroup]?.[month]?.total ? 
                  Math.round((deanAttendanceReports[selectedStatsGroup][month].present / deanAttendanceReports[selectedStatsGroup][month].total) * 100) : 0}%
              </Typography>
            </Stack>
          </Stack>
          <Box>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={deanAttendanceReports[selectedStatsGroup]?.[month]?.total ? 
                    Math.round((deanAttendanceReports[selectedStatsGroup][month].present / deanAttendanceReports[selectedStatsGroup][month].total) * 100) : 0} 
                  sx={{ height: 12, borderRadius: 6, bgcolor: '#eee', flex: 1, '& .MuiLinearProgress-bar': { bgcolor: '#4caf50' } }} 
                />
              </Box>
            </Box>
          </Box>
        </Paper>
        {/* Карточка критических студентов */}
        <Paper elevation={2} sx={{ borderRadius: 12, p: 4, flex: 2, minWidth: 400 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>Студенты с критической посещаемостью</Typography>
          <Stack spacing={2}>
            {deanCriticalStudents.map((s) => (
              <Paper key={s.name + s.group} sx={{ p: 2, borderRadius: 2.5, display: 'flex', alignItems: 'center', bgcolor: '#fafbfc', border: '1px solid #eaeaea' }}>
                <Box flex={1}>
                  <Typography fontWeight={600} fontSize={16}>{s.name}</Typography>
                  <Typography fontSize={15} color="#888">{s.group}</Typography>
                </Box>
                <Chip label={`${s.percentMissed}% пропусков`} sx={{ fontWeight: 700, fontSize: 16, borderRadius: 2, bgcolor: 'rgba(211,47,47,0.10)', color: '#d32f2f', border: '1.5px solid #d32f2f', minWidth: 60, ml: 2 }} />
                <Chip
                  label="Подробнее"
                  clickable
                  sx={{ ml: 2, borderRadius: 999, bgcolor: '#fff', color: '#111', fontWeight: 600, fontSize: 15, px: 2, minHeight: 36, border: '1.5px solid #111', '&:hover': { bgcolor: '#f5f5f5' } }}
                  onClick={() => setSelectedStudent({ ...deanStudentDetailsMock, ...s })}
                />
              </Paper>
            ))}
          </Stack>
        </Paper>
      </Stack>
      {/* PDF отчёт */}
      <Paper elevation={2} sx={{ borderRadius: 12, p: 4, mt: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>Генерация PDF-отчёта по группе</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" mb={2}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Группа</InputLabel>
            <Select value={group} label="Группа" onChange={e => setGroup(e.target.value)}>
              {Object.keys(deanAttendanceReports).map(g => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Месяц</InputLabel>
            <Select value={month} label="Месяц" onChange={e => setMonth(e.target.value)}>
              {Object.keys(deanAttendanceReports[group] || {}).map(m => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{ borderRadius: 999, bgcolor: '#111', color: '#fff', fontWeight: 600, fontSize: 16, px: 4, minHeight: 40, boxShadow: '0 2px 8px #0001', border: 'none', textTransform: 'none', '&:hover': { bgcolor: '#222' } }}
            onClick={handlePreviewPDF}
            disabled={pdfLoading || !deanAttendanceReports[group]?.[month]}
          >
            {pdfLoading ? 'Генерация...' : 'Предпросмотр PDF'}
          </Button>
          <Button
            variant="contained"
            sx={{ borderRadius: 999, bgcolor: '#111', color: '#fff', fontWeight: 600, fontSize: 16, px: 4, minHeight: 40, boxShadow: '0 2px 8px #0001', border: 'none', textTransform: 'none', '&:hover': { bgcolor: '#222' } }}
            onClick={handleDownloadPDF}
            disabled={pdfLoading || !deanAttendanceReports[group]?.[month]}
          >
            {pdfLoading ? 'Генерация...' : 'Скачать PDF-отчёт'}
          </Button>
        </Stack>
      </Paper>
      {/* Модальное окно предпросмотра PDF */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 4, bgcolor: '#fff' }}>
          {pdfPreviewUrl ? (
            <iframe
              src={pdfPreviewUrl}
              title="PDF Preview"
              style={{ width: '100%', height: '70vh', border: '1px solid #ccc', background: '#fff' }}
            />
          ) : (
            <Typography color="#111">Генерация PDF...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDownloadPDF}
            variant="contained"
            sx={{ borderRadius: 999, bgcolor: '#111', color: '#fff', fontWeight: 600, fontSize: 16, px: 4, minHeight: 40, textTransform: 'none', '&:hover': { bgcolor: '#222' } }}
            disabled={pdfLoading}
          >
            Скачать PDF
          </Button>
          <Button
            onClick={handleClosePreview}
            variant="outlined"
            sx={{ borderRadius: 999, color: '#111', borderColor: '#111', fontWeight: 600, fontSize: 16, px: 4, minHeight: 40, textTransform: 'none', '&:hover': { bgcolor: '#f5f5f5' } }}
          >
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
      {/* Модалка подробностей студента */}
      <DeanStudentDetailsModal open={!!selectedStudent} student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </Box>
  );
}