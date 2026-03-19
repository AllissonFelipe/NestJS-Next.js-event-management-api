'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = Array.isArray(data.message) ? data.message.join('\n') : data.message;
        setError(message);
        return;
      }
      // salvar token
      localStorage.setItem('token', data.accessToken);

      router.push('/dashboard');
    } catch (err) {
      console.error('Register error:', err);
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col gap-4 bg-white p-8 rounded-xl shadow-lg w-[350px]"
    >
      <h2 className="text-2xl font-bold text-center text-black">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded text-black"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        className="border p-2 rounded text-black"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <div className="text-red-500 text-sm whitespace-pre-line">{error}</div>}

      <button
        type="submit"
        disabled={loading || !email || !password}
        className="bg-black text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
