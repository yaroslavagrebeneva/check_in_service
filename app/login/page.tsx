'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

const LoginPage = () => {
  const handleLogin = async () => {
    await signIn('keycloak', {
      callbackUrl: 'http://localhost:3000/dashboard',
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Добро пожаловать</h1>
      <Button onClick={handleLogin}>Войти через Keycloak</Button>
    </div>
  );
};

export default LoginPage;
