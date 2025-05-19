// Список студентов
export const studentsList = [
  { name: 'Иванов Иван' },
  { name: 'Петров Петр' },
  { name: 'Сидорова Анна' },
  { name: 'Кузнецов Илья' },
  { name: 'Смирнова Мария' },
  { name: 'Васильев Павел' },
  { name: 'Морозова Ольга' },
  { name: 'Григорьев Артём' },
  { name: 'Егорова Дарья' },
  { name: 'Ковалёв Денис' },
  { name: 'Романова Светлана' },
  { name: 'Зайцев Никита' },
];

// Дни недели
export const weekDays = [
  { key: 'mon', label: 'Пн', date: '2024-06-10', full: 'Понедельник, 10 июня' },
  { key: 'tue', label: 'Вт', date: '2024-06-11', full: 'Вторник, 11 июня' },
  { key: 'wed', label: 'Ср', date: '2024-06-12', full: 'Среда, 12 июня' },
  { key: 'thu', label: 'Чт', date: '2024-06-13', full: 'Четверг, 13 июня' },
  { key: 'fri', label: 'Пт', date: '2024-06-14', full: 'Пятница, 14 июня' },
];

// Расписание
export const schedule = [
  // Понедельник
  {
    ...weekDays[0],
    lessons: [
      {
        time: '11:30',
        end: '13:00',
        subject: 'Математическая логика и теория алгоритмов',
        type: 'Лекция',
        room: '236',
        teacher: 'Абдураманов З.Ш.',
        group: studentsList.map(s => ({ ...s, status: 'П' })),
      },
      {
        time: '13:10',
        end: '14:40',
        subject: 'Математическая логика и теория алгоритмов',
        type: 'Практика',
        room: '236',
        teacher: 'Абдураманов З.Ш.',
        group: studentsList.map(s => ({ ...s, status: 'П' })),
      },
    ],
  },
  // Вторник
  {
    ...weekDays[1],
    lessons: [
      {
        time: '10:15',
        end: '11:45',
        subject: 'Базы данных',
        type: 'Лекция',
        room: '101',
        teacher: 'Иванова А.А.',
        group: studentsList.map(s => ({ ...s, status: 'П' })),
      },
      {
        time: '12:00',
        end: '13:30',
        subject: 'Базы данных',
        type: 'Практика',
        room: '101',
        teacher: 'Иванова А.А.',
        group: studentsList.map(s => ({ ...s, status: 'П' })),
      },
    ],
  },
  // Среда
  {
    ...weekDays[2],
    lessons: [
      {
        time: '09:00',
        end: '10:30',
        subject: 'Физика',
        type: 'Лекция',
        room: '202',
        teacher: 'Смирнов А.А.',
        group: studentsList.map(s => ({ ...s, status: 'П' })),
      },
      {
        time: '10:40',
        end: '12:10',
        subject: 'Физика',
        type: 'Практика',
        room: '202',
        teacher: 'Смирнов А.А.',
        group: studentsList.map(s => ({ ...s, status: 'П' })),
      },
    ],
  },
  // Четверг
  {
    ...weekDays[3],
    lessons: [
      {
        time: '11:00',
        end: '12:30',
        subject: 'Матанализ',
        type: 'Лекция',
        room: '303',
        teacher: 'Петров П.П.',
        group: studentsList.map(s => ({ ...s, status: 'П' })),
      },
      {
        time: '12:40',
        end: '14:10',
        subject: 'Матанализ',
        type: 'Практика',
        room: '303',
        teacher: 'Петров П.П.',
        group: studentsList.map(s => ({ ...s, status: 'П' })),
      },
    ],
  },
  // Пятница
  {
    ...weekDays[4],
    lessons: [
      {
        time: '10:00',
        end: '11:30',
        subject: 'История',
        type: 'Лекция',
        room: '105',
        teacher: 'Васильев П.П.',
        group: studentsList.map(s => ({ ...s, status: 'П' })),
      },
      {
        time: '11:40',
        end: '13:10',
        subject: 'История',
        type: 'Практика',
        room: '105',
        teacher: 'Васильев П.П.',
        group: studentsList.map(s => ({ ...s, status: 'П' })),
      },
    ],
  },
];

// История посещаемости (личная)
export const personalHistory = [
  { date: '2024-06-10', time: '10:15', subject: 'Базы данных', student: 'Иванов Иван', status: 'Присутствовал' },
  { date: '2024-06-09', time: '08:30', subject: 'Алгоритмизация', student: 'Иванов Иван', status: 'Присутствовал' },
  { date: '2024-06-08', time: '12:00', subject: 'Матанализ', student: 'Иванов Иван', status: 'Отсутствовал' },
];

// История посещаемости (групповая)
export const groupHistory = [
  { date: '2024-06-10', time: '10:15', subject: 'Базы данных', student: 'Иванов Иван', status: 'Присутствовал' },
  { date: '2024-06-10', time: '10:15', subject: 'Базы данных', student: 'Петров Петр', status: 'Отсутствовал' },
  { date: '2024-06-10', time: '10:15', subject: 'Базы данных', student: 'Сидорова Анна', status: 'Присутствовал' },
  { date: '2024-06-09', time: '08:30', subject: 'Алгоритмизация', student: 'Иванов Иван', status: 'Присутствовал' },
  { date: '2024-06-09', time: '08:30', subject: 'Алгоритмизация', student: 'Петров Петр', status: 'Присутствовал' },
  { date: '2024-06-09', time: '08:30', subject: 'Алгоритмизация', student: 'Сидорова Анна', status: 'Отсутствовал' },
];

// Пропуски (личные)
export const personalAbsences = [
  { date: '2024-06-08', time: '12:00', subject: 'Матанализ', student: 'Иванов Иван', reason: 'Болезнь', type: 'illness', file: null, desc: '', accepted: true },
  { date: '2024-06-05', time: '10:15', subject: 'Базы данных', student: 'Иванов Иван', reason: 'Уважительная', type: 'valid', file: null, desc: 'Семейные обстоятельства', accepted: true },
];

// Пропуски (групповые)
export const groupAbsences = [
  { date: '2024-06-10', time: '10:15', subject: 'Базы данных', student: 'Петров Петр', reason: 'Не указана', type: '', file: null, desc: '' },
  { date: '2024-06-09', time: '08:30', subject: 'Алгоритмизация', student: 'Сидорова Анна', reason: 'Болезнь', type: 'illness', file: null, desc: '', accepted: true },
  { date: '2024-06-08', time: '12:00', subject: 'Матанализ', student: 'Иванов Иван', reason: 'Болезнь', type: 'illness', file: null, desc: '', accepted: true },
  { date: '2024-06-05', time: '10:15', subject: 'Базы данных', student: 'Кузнецов Илья', reason: 'Уважительная', type: 'valid', file: null, desc: 'Семейные обстоятельства', accepted: true },
];

// Статистика (личная)
export const personalStats = {
  total: 30,
  attended: 28,
  missed: 2,
  percent: Math.round((28 / 30) * 100)
};

// Статистика (групповая)
export const groupStats = {
  total: 90,
  attended: 75,
  missed: 15,
  percent: Math.round((75 / 90) * 100)
}; 