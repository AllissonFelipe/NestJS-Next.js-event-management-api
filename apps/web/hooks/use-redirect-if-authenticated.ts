'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useRedirectIfAuthenticated() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me', {
      credentials: 'include',
    }).then((res) => {
      if (res.ok) {
        router.replace('/events');
      }
    });
  }, []);
}
