'use client';

import { useRouter } from 'next/navigation';

export default function LogoutForm() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch(`/api/auth/logout`, {
      method: `POST`,
    });

    router.push(`/auth/login`);
  };

  return <button onClick={handleLogout}>Sair</button>;
}
