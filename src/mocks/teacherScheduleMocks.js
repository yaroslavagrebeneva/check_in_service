export const weekDays = [
  { key: 'mon', label: 'Пн', date: '2024-06-10', full: 'Понедельник, 10 июня' },
  { key: 'tue', label: 'Вт', date: '2024-06-11', full: 'Вторник, 11 июня' },
  { key: 'wed', label: 'Ср', date: '2024-06-12', full: 'Среда, 12 июня' },
  { key: 'thu', label: 'Чт', date: '2024-06-13', full: 'Четверг, 13 июня' },
  { key: 'fri', label: 'Пт', date: '2024-06-14', full: 'Пятница, 14 июня' },
];

export const groups = ['ПМИ-101', 'И-23', 'ФИИТ-22'];

export const schedule = [
  // Понедельник
  {
    day: 'Понедельник, 10 июня',
    lessons: [
      {
        time: '11:30',
        end: '13:00',
        subject: 'Математическая логика',
        room: '236',
        group: 'ПМИ-101',
        students: [
          { name: 'Иванов Иван', status: 'П', reason: null },
          { name: 'Петров Петр', status: 'Н', reason: null },
          { name: 'Сидорова Анна', status: 'П', reason: null },
        ]
      },
      {
        time: '13:10',
        end: '14:40',
        subject: 'Математическая логика',
        room: '236',
        group: 'И-23',
        students: [
          { name: 'Кузнецов Илья', status: 'П', reason: null },
          {
            name: 'Смирнова Мария',
            status: 'Н',
            reason: 'Болезнь',
            reasonType: 'illness',
            file: 'spravka.pdf',
            fileUrl: '#',
            desc: 'ОРВИ',
            status: 'pending'
          },
        ]
      },
    ]
  },
  // Вторник
  {
    day: 'Вторник, 11 июня',
    lessons: [
      {
        time: '10:15',
        end: '11:45',
        subject: 'Базы данных',
        room: '101',
        group: 'ПМИ-101',
        students: [
          { name: 'Иванов Иван', status: 'П', reason: null },
          { name: 'Петров Петр', status: 'П', reason: null },
          { name: 'Сидорова Анна', status: 'Н', reason: null },
        ]
      },
    ]
  },
  // Среда
  {
    day: 'Среда, 12 июня',
    lessons: [
      {
        time: '09:00',
        end: '10:30',
        subject: 'Физика',
        room: '202',
        group: 'ФИИТ-22',
        students: [
          { name: 'Григорьев Артём', status: 'П', reason: null },
          { name: 'Егорова Дарья', status: 'П', reason: null },
          { name: 'Ковалёв Денис', status: 'Н', reason: null },
        ]
      },
      {
        time: '10:40',
        end: '12:10',
        subject: 'Физика',
        room: '202',
        group: 'ПМИ-101',
        students: [
          { name: 'Иванов Иван', status: 'П', reason: null },
          { name: 'Петров Петр', status: 'П', reason: null },
          { name: 'Сидорова Анна', status: 'П', reason: null },
        ]
      },
    ]
  },
  // Четверг
  {
    day: 'Четверг, 13 июня',
    lessons: [
      {
        time: '11:00',
        end: '12:30',
        subject: 'Матанализ',
        room: '303',
        group: 'ПМИ-101',
        students: [
          { name: 'Иванов Иван', status: 'П', reason: null },
          { name: 'Петров Петр', status: 'Н', reason: null },
          { name: 'Сидорова Анна', status: 'П', reason: null },
        ]
      },
      {
        time: '12:40',
        end: '14:10',
        subject: 'Матанализ',
        room: '303',
        group: 'И-23',
        students: [
          { name: 'Кузнецов Илья', status: 'П', reason: null },
          { name: 'Смирнова Мария', status: 'П', reason: null },
        ]
      },
    ]
  },
  // Пятница
  {
    day: 'Пятница, 14 июня',
    lessons: [
      {
        time: '10:00',
        end: '11:30',
        subject: 'История',
        room: '105',
        group: 'ФИИТ-22',
        students: [
          { name: 'Григорьев Артём', status: 'П', reason: null },
          { name: 'Егорова Дарья', status: 'Н', reason: null },
          { name: 'Ковалёв Денис', status: 'П', reason: null },
        ]
      },
      {
        time: '11:40',
        end: '13:10',
        subject: 'История',
        room: '105',
        group: 'ПМИ-101',
        students: [
          { name: 'Иванов Иван', status: 'П', reason: null },
          { name: 'Петров Петр', status: 'П', reason: null },
          { name: 'Сидорова Анна', status: 'Н', reason: null },
        ]
      },
    ]
  },
]; 