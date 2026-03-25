'use client';

import { useEffect, useState } from 'react';
import { AdminProfile } from '../../types/admin-profile.type';

export default function AdminProfileForm() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await fetch(`/api/admin/profile`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || `Falha ao buscar ADMIN profile.`);
          return;
        }
        if (data) {
          console.log('Profile do ADMIN: ', data);
          setAdminProfile(data);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(`Erro ao buscar ADMIN profile: ${error.message}`);
        } else {
          setError(`Erro desconhecido ao buscar ADMIN profile: ${error}`);
        }
        console.log(`Erro ao buscar ADMIN profile: `, error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProfile();
  }, []);

  if (loading) {
    return <div className="text-center p-6">Carregando perfil...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center p-6">{error}</div>;
  }
  if (!adminProfile) {
    return <div className="text-center p-6">Nenhum perfil encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
            {adminProfile.fullName?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{adminProfile.fullName}</h2>
            <p className="text-gray-500">{adminProfile.email}</p>
          </div>
        </div>

        {/* Grid info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <span className="text-gray-500 text-sm">ID</span>
            <p className="font-medium break-all">{adminProfile.id}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <span className="text-gray-500 text-sm">Role</span>
            <p className="font-medium">{adminProfile.personRole.role}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <span className="text-gray-500 text-sm">CPF</span>
            <p className="font-medium">{adminProfile.cpf}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <span className="text-gray-500 text-sm">Conta ativa</span>
            <p className="font-medium">{adminProfile ? 'Ativa' : 'Inativa'}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <span className="text-gray-500 text-sm">Criado em</span>
            <p className="font-medium">
              {adminProfile.createdAt ? new Date(adminProfile.createdAt).toLocaleString() : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
