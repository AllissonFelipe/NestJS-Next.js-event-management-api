'use client';

import React from 'react';
import useLogin from '../hooks/use-login';
import { useRouter } from 'next/navigation';

type LoginFormProps = {
  url: string;
};

export default function LoginForm({ url }: LoginFormProps) {
  const loginHook = useLogin(url);
  const rounter = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginHook.email || loginHook.password) {
      loginHook.setError(`Preencha todos os campos`)
      return; 
    }

    const data = await loginHook.handleLogin();
    if (data) {
      console.log('Login sucesso: ', data);

      // salvar token
      localStorage.setItem("accessToken", data.accessToken);
      // redirecionar
      rounter.push('/events');
    }
  };

  return (    
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        placeholder="Email"
        value={loginHook.email}
        onChange={(e) => loginHook.setEmail(e.target.value)}
        className="border p-2"
      />
      <label htmlFor="password">Senha:</label>
      <input
        type="password"
        id="password"
        placeholder="Senha"
        value={loginHook.password}
        onChange={(e) => loginHook.setPassword(e.target.value)}
        className="border p-2"
      />

      <button
        type="submit"
        disabled={loginHook.loading}
        className="bg-blue-500 text-white p-2"
      >
        {loginHook.loading ? "Entrando..." : "Entrar"}
      </button>
      {loginHook.error && 
        <span className='text-red-500'>{loginHook.error}</span>  
      }
    </form>
  );
}
