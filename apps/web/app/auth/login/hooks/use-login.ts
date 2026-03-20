import { useState } from 'react';

export default function useLogin(url: string) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>('');

  async function handleLogin() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        let message = `Erro ao realizar login`;
        try {
          const errorData = await res.json();
          message = errorData.message || message;
        } catch {
          message = res.statusText || message;
        }
        throw new Error(message);
      }

      const data = await res.json();

      return data;
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') return;
        setError(err.message);
        console.error('Erro ao buscar evento:', err.message);
      } else {
        setError(`Erro inesperado`);
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    setError,
    handleLogin,
  };
}
