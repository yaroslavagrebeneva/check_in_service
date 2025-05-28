export const deanStudentDetailsMock = {
  name: 'Иванов Иван Иванович',
  faculty: 'Факультет экономики, менеджмента и информационных технологий',
  department: 'Кафедра прикладной информатики',
  speciality: '09.03.03 Прикладная информатика',
  program: 'Прикладная информатика в информационной сфере',
  course: '2 курс бакалавриат 09.03.03',
  missedMonth: 7,
  missedRespectful: 3,
  missedOther: 4,
}; 

export const mockHistory = [
  {
    time: '11:30–13:00',
    date: '2024-06-10',
    subject: 'Математическая логика',
    teacher: 'Иванов А.А.',
    status: 'П'
  },
  {
    time: '10:15–11:45',
    date: '2024-06-11',
    subject: 'Базы данных',
    teacher: 'Петров Б.Б.',
    status: 'Н'
  },
  {
    time: '09:00–10:30',
    date: '2024-06-12',
    subject: 'Физика',
    teacher: 'Сидоров В.В.',
    status: 'П'
  }
];

export const mockAbsences = [
  {
    time: '10:15–11:45',
    date: '2024-06-11',
    subject: 'Базы данных',
    teacher: 'Петров Б.Б.',
    reason: 'Не указана',
    accepted: false
  },
  {
    time: '11:40–13:10',
    date: '2024-06-14',
    subject: 'История',
    teacher: 'Кузнецов Г.Г.',
    reason: 'Болезнь',
    type: 'illness',
    desc: 'ОРВИ',
    file: 'spravka.pdf',
    accepted: false
  }
];