-- Создание базы данных
CREATE DATABASE IF NOT EXISTS girls_app;
USE girls_app;

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'starosta', 'dean')),
    group_name VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы предметов
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы расписания
CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id),
    teacher_id INTEGER REFERENCES users(id),
    group_name VARCHAR(20) NOT NULL,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы QR-кодов
CREATE TABLE IF NOT EXISTS qr_codes (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER REFERENCES schedule(id),
    code VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Создание таблицы посещаемости
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    schedule_id INTEGER REFERENCES schedule(id),
    qr_code_id INTEGER REFERENCES qr_codes(id),
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_schedule_id ON attendance(schedule_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_qr_codes_code ON qr_codes(code);
CREATE INDEX IF NOT EXISTS idx_qr_codes_expires_at ON qr_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_schedule_group_name ON schedule(group_name);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_group_name ON users(group_name);

-- Вставка тестовых данных

-- Тестовые предметы
INSERT INTO subjects (name, code) VALUES 
    ('База данных', 'DB-101'),
    ('Информационная безопасность', 'IS-101'),
    ('Алгоритмы и программирование', 'AP-101')
ON CONFLICT (code) DO NOTHING;

-- Тестовые пользователи
INSERT INTO users (username, email, full_name, role, group_name) VALUES 
    ('teacher', 'teacher@example.com', 'Полина Лебедева', 'teacher', NULL),
    ('student', 'student@example.com', 'Иван Иванов', 'student', 'ИВТ-101'),
    ('starosta', 'starosta@example.com', 'Анна Петрова', 'starosta', 'ИВТ-101'),
    ('dean', 'dean@example.com', 'Мария Сидорова', 'dean', NULL)
ON CONFLICT (username) DO NOTHING;

-- Тестовое расписание
INSERT INTO schedule (subject_id, teacher_id, group_name, day_of_week, start_time, end_time, room)
SELECT 
    s.id as subject_id,
    u.id as teacher_id,
    'ИВТ-101' as group_name,
    1 as day_of_week,
    '10:00' as start_time,
    '11:30' as end_time,
    '301' as room
FROM subjects s
CROSS JOIN users u
WHERE u.username = 'teacher'
LIMIT 1
ON CONFLICT DO NOTHING; 