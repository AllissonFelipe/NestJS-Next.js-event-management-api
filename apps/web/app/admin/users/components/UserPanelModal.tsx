'use client';

import { useEffect } from 'react';

type UserPanelModalProps = {
  userId: string;
  onClose: () => void;
};

export default function UserPanelModal({ userId, onClose }: UserPanelModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 w-[400px] shadow-xl"
      >
        <h2 className="text-lg font-semibold mb-4">Usuário: {userId}</h2>

        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">
          Fechar
        </button>
      </div>
    </div>
  );
}
