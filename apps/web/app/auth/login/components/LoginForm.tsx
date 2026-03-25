'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError(`Preencha todos os campos`);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao logar.');
        return;
      }
      if (data) {
        console.log('Login sucesso: ', data);

        // redirecionar
        router.push('/events');
      }
    } catch (error) {
      setError(`Erro de conexão`);
      console.log(`Erro ao logar: `, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />
      <label htmlFor="password">Senha:</label>
      <input
        type="password"
        id="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />

      <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2">
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      {error && <span className="text-red-500">{error}</span>}
    </form>
  );
}
