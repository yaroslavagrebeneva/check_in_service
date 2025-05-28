export const deanAttendanceReports = {
  'И-21': {
    '2024-06': {
      total: 30,
      present: 20,
      absent: 10,
      details: [
        { name: 'Иванов Иван', status: 'Пропуск', percentMissed: 70, curator: 'Петров П.П.', starosta: 'Сидорова А.А.', speciality: 'ПМИ' },
        { name: 'Петров Петр', status: 'Пропуск', percentMissed: 65, curator: 'Петров П.П.', starosta: 'Сидорова А.А.', speciality: 'ПМИ' },
        { name: 'Смирнова Анна', status: 'Пропуск', percentMissed: 30, curator: 'Петров П.П.', starosta: 'Сидорова А.А.', speciality: 'ПМИ' },
      ]
    }
  },
  'И-22': {
    '2024-06': {
      total: 28,
      present: 25,
      absent: 3,
      details: [
        { name: 'Козлова Кира', status: 'Пропуск', percentMissed: 62, curator: 'Иванова И.И.', starosta: 'Васильев В.В.', speciality: 'ФИИТ' },
        { name: 'Волков Влад', status: 'Пропуск', percentMissed: 20, curator: 'Иванова И.И.', starosta: 'Васильев В.В.', speciality: 'ФИИТ' },
      ]
    }
  }
};

export const deanCriticalStudents = [
  { name: 'Иванов Иван', group: 'И-21', curator: 'Петров П.П.', starosta: 'Сидорова А.А.', speciality: 'ПМИ', percentMissed: 70, status: 'none' },
  { name: 'Петров Петр', group: 'И-21', curator: 'Петров П.П.', starosta: 'Сидорова А.А.', speciality: 'ПМИ', percentMissed: 65, status: 'none' },
  { name: 'Козлова Кира', group: 'И-22', curator: 'Иванова И.И.', starosta: 'Васильев В.В.', speciality: 'ФИИТ', percentMissed: 62, status: 'none' },
];

export const deanStats = {
  avgAttendance: 91,
  totalStudents: 58,
  totalAbsences: 13,
  bestGroup: 'ПМИ-23',
};