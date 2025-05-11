import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { UserIcon, MailIcon, LockIcon, UsersIcon } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    group: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        navigate('/');
      } else {
        setMessage(data.detail || 'Ошибка регистрации');
      }
    } catch (error) {
      setMessage('Ошибка сервера');
    }
  };

  function InputWithIcon({ Icon, ...props }) {
    return (
      <div className="relative">
        <Icon className="absolute top-1/2 left-3 transform -translate-y-1/2 text-white/60" size={18} />
        <Input 
          {...props} 
          className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-[#00D4FF] focus:ring-[#00D4FF] rounded-xl" 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-32">
      <div className="bg-white/10 rounded-2xl p-8 shadow-xl max-w-md w-full">
        <Card className="w-full p-8 bg-gradient-to-br from-[#3A2B4D]/80 to-[#5A3B6D]/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-4 text-white">Регистрация</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="flex gap-4">
                <InputWithIcon
                  placeholder="Фамилия"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  Icon={UserIcon}
                />
                <InputWithIcon
                  placeholder="Имя"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  Icon={UserIcon}
                />
              </div>
              <InputWithIcon
                placeholder="Отчество"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                Icon={UserIcon}
              />
              <InputWithIcon
                placeholder="Группа"
                name="group"
                value={formData.group}
                onChange={handleChange}
                Icon={UsersIcon}
              />
              <InputWithIcon
                type="email"
                placeholder="Почта"
                name="email"
                value={formData.email}
                onChange={handleChange}
                Icon={MailIcon}
              />
              <InputWithIcon
                type="password"
                placeholder="Пароль"
                name="password"
                value={formData.password}
                onChange={handleChange}
                Icon={LockIcon}
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl focus:border-[#00D4FF] focus:ring-[#00D4FF] outline-none"
              >
                <option value="student" className="bg-[#3A2B4D]">Студент</option>
                <option value="starosta" className="bg-[#3A2B4D]">Староста</option>
                <option value="teacher" className="bg-[#3A2B4D]">Преподаватель</option>
              </select>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] text-white font-semibold rounded-xl hover:brightness-110 transition-all duration-300"
              >
                Зарегистрироваться
              </Button>
            </form>
            {message && (
              <p className="mt-4 text-center text-red-400">{message}</p>
            )}
            <p className="mt-6 text-center text-white/80">
              Уже есть аккаунт?{' '}
              <Link to="/" className="text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors">
                Войти
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}