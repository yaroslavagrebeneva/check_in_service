export const weekDays = [
  { key: 'mon', label: 'Пн' },
  { key: 'tue', label: 'Вт' },
  { key: 'wed', label: 'Ср' },
  { key: 'thu', label: 'Чт' },
  { key: 'fri', label: 'Пт' },
  { key: 'sat', label: 'Сб' },
];

export const schedule = [
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
          { name: 'Иванов Иван', status: 'П', markType: 'qr' },
          { name: 'Петров Петр', status: 'Н', markType: 'manual' },
          { name: 'Сидорова Анна', status: 'П', markType: 'manual' },
        ],
      },
      {
        time: '13:10',
        end: '14:40',
        subject: 'Математическая логика',
        room: '236',
        group: 'И-23',
        students: [
          { name: 'Кузнецов Илья', status: 'П', markType: 'qr' },
          { name: 'Смирнова Мария', status: 'Н', markType: 'manual' },
        ],
      },
    ],
  },
  {
    day: 'Вторник, 11 июня',
    lessons: [
      {
        time: '09:00',
        end: '10:30',
        subject: 'Базы данных',
        room: '312',
        group: 'ПМИ-101',
        students: [
          { name: 'Иванов Иван', status: 'П', markType: 'qr' },
          { name: 'Петров Петр', status: 'П', markType: 'manual' },
          { name: 'Сидорова Анна', status: 'Н', markType: 'manual' },
        ],
      },
      {
        time: '10:40',
        end: '12:10',
        subject: 'Программирование',
        room: '408',
        group: 'И-23',
        students: [
          { name: 'Кузнецов Илья', status: 'Н', markType: 'manual' },
          { name: 'Смирнова Мария', status: 'П', markType: 'qr' },
        ],
      },
    ],
  },
  {
    day: 'Среда, 12 июня',
    lessons: [
      {
        time: '11:30',
        end: '13:00',
        subject: 'Алгоритмы и структуры данных',
        room: '214',
        group: 'ПМИ-101',
        students: [
          { name: 'Иванов Иван', status: 'Н', markType: 'manual' },
          { name: 'Петров Петр', status: 'П', markType: 'qr' },
          { name: 'Сидорова Анна', status: 'П', markType: 'manual' },
        ],
      },
      {
        time: '13:10',
        end: '14:40',
        subject: 'Сети и телекоммуникации',
        room: '305',
        group: 'И-23',
        students: [
          { name: 'Кузнецов Илья', status: 'П', markType: 'qr' },
          { name: 'Смирнова Мария', status: 'Н', markType: 'manual' },
        ],
      },
    ],
  },
  {
    day: 'Четверг, 13 июня',
    lessons: [
      {
        time: '09:00',
        end: '10:30',
        subject: 'Операционные системы',
        room: '410',
        group: 'ПМИ-101',
        students: [
          { name: 'Иванов Иван', status: 'П', markType: 'qr' },
          { name: 'Петров Петр', status: 'Н', markType: 'manual' },
          { name: 'Сидорова Анна', status: 'П', markType: 'manual' },
        ],
      },
      {
        time: '10:40',
        end: '12:10',
        subject: 'Математическая логика',
        room: '236',
        group: 'И-23',
        students: [
          { name: 'Кузнецов Илья', status: 'П', markType: 'qr' },
          { name: 'Смирнова Мария', status: 'П', markType: 'manual' },
        ],
      },
    ],
  },
  {
    day: 'Пятница, 14 июня',
    lessons: [
      {
        time: '11:30',
        end: '13:00',
        subject: 'Программная инженерия',
        room: '315',
        group: 'ПМИ-101',
        students: [
          { name: 'Иванов Иван', status: 'П', markType: 'qr' },
          { name: 'Петров Петр', status: 'П', markType: 'manual' },
          { name: 'Сидорова Анна', status: 'Н', markType: 'manual' },
        ],
      },
      {
        time: '13:10',
        end: '14:40',
        subject: 'Базы данных',
        room: '312',
        group: 'И-23',
        students: [
          { name: 'Кузнецов Илья', status: 'Н', markType: 'manual' },
          { name: 'Смирнова Мария', status: 'П', markType: 'qr' },
        ],
      },
    ],
  },
];