'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  token: string;
}

export default function ResetPasswordForm({ token }: Props) {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('As senhas devem ser iguais.');
      return;
    }

    try {
      setStatus('loading');
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data.message || 'Erro ao redefinir senha.');
      } else {
        setStatus('success');
        setMessage(data.message || 'Senha redefinida com sucesso');
      }
    } catch (error) {
      setStatus('error');
      const msg = error instanceof Error ? error.message : 'Erro de conexão';
      setMessage(msg);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        {status === 'idle' && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold text-black mb-4">Redefinir senha</h1>

            <input
              type="password"
              placeholder="Nova senha"
              className="border p-2 rounded text-black"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirmar senha"
              className="border p-2 rounded text-black"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button type="submit" className="bg-black text-white py-2 rounded">
              Redefinir senha
            </button>
          </form>
        )}

        {status === 'loading' && (
          <>
            <h1 className="text-xl font-semibold mb-4">Atualizando senha...</h1>
            <p>Aguarde um momento.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <h1 className="text-xl font-semibold text-green-600 mb-4">✅ Senha atualizada!</h1>

            <p className="mb-6 text-black">{message}</p>

            <button
              onClick={() => router.push('/auth/login')}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Ir para login
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-xl font-semibold text-red-600 mb-4">❌ Erro</h1>

            <p className="text-black mb-6">{message}</p>

            <button
              onClick={() => setStatus('idle')}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Tentar novamente
            </button>
          </>
        )}
      </div>
    </div>
  );
}
