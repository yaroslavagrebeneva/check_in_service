import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { MailIcon, LockIcon } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        console.log('Успешный вход');
      }
    } catch (error) {
      setMessage('Ошибка входа');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <Card className="w-full p-8 bg-gradient-to-br from-[#3A2B4D]/80 to-[#5A3B6D]/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-4 text-white">Вход</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
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
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] text-white font-semibold rounded-xl hover:brightness-110 transition-all duration-300"
              >
                Войти
              </Button>
            </form>
            {message && (
              <p className="mt-4 text-center text-red-400">{message}</p>
            )}
            <p className="mt-6 text-center text-white/80">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors">
                Зарегистрироваться
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
