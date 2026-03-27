'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { User } from '../types/user.type';
import { UsersFiltersType } from '../types/user-filter.type';
import { Calendar } from '@/components/ui/calendar';
import { ptBR } from 'date-fns/locale';
import UserPanelModal from './UserPanelModal';

export default function UsersForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<UsersFiltersType>({
    fullName: '',
    cpf: '',
    email: '',
    isActive: '',
    createdAt: '',
  });
  const [showCreatedAtCalendar, setShowCreatedAtCalendar] = useState(false);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const formatToISODate = (date: Date) =>
    new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();

  const getFilters = useCallback(async () => {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(limit));

    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
    return url.toString();
  }, [debouncedFilters, page, limit]);

  const clearFilters = () => {
    setFilters({
      fullName: '',
      cpf: '',
      email: '',
      isActive: '',
      createdAt: '',
    });
    setShowCreatedAtCalendar(false);
  };

  const fetchUsers = useCallback(async () => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    const urlWithFilter = await getFilters();

    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${urlWithFilter}`, {
        signal: controllerRef.current.signal,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Falha ao buscar usuários.`);
        return;
      }
      console.log(`Usuários: `, data.items);
      setUsers(data.items ?? []);
      setTotalPages(data.meta.totalPages ?? 1);
      setHasNextPage(data.meta.hasNextPage);
      setHasPreviousPage(data.meta.hasPreviousPage);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') return;
        setError(`Erro ao buscar usuários: ${error.message}`);
      } else {
        setError(`Erro desconhecido ao buscar usuários: ${error}`);
      }
      console.log(`Erro ao buscar usuários: `, error);
    } finally {
      setLoading(false);
    }
  }, [getFilters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreatedAtDate = (date?: Date) => {
    setShowCreatedAtCalendar(false);
    setFilters((prev) => ({
      ...prev,
      createdAt: date ? formatToISODate(date) : '',
    }));
  };

  const formatDate = (date: Date) => date.toLocaleDateString('pt-BR') || '';

  return (
    <div className="max-w-6xl mx-auto mt-6 space-y-4">
      {/* FILTROS */}
      <div className="flex items-center justify-between">
        <div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
            <p className="text-sm text-gray-500">
              Refine os usuários por nome, cpf, email e data de criação
            </p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm px-3 py-1.5 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
          >
            Limpar
          </button>
        </div>
        {/* CARD */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
          {/* INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* NOME */}
            <input
              type="text"
              placeholder="🔍 Buscar por nome..."
              value={filters.fullName ?? ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, fullName: e.target.value }))}
              className="border rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* CPF */}
            <input
              type="text"
              placeholder="🔍 Buscar por cpf..."
              value={filters.cpf ?? ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, cpf: e.target.value }))}
              className="border rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* EMAIL */}
            <input
              type="text"
              placeholder="🔍 Buscar por email..."
              value={filters.email ?? ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, email: e.target.value }))}
              className="border rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* DATA DE CRIAÇÃO */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={(e) => {
                  setShowCreatedAtCalendar((prev) => !prev);
                }}
                className="w-full border rounded-xl px-3 py-2 text-left bg-white hover:border-blue-400 transition"
              >
                {filters.createdAt ? formatDate(new Date(filters.createdAt)) : 'Data de criação'}
              </button>
              {showCreatedAtCalendar && (
                <div className="absolute z-20 mt-2 bg-white shadow-xl rounded-xl p-4">
                  <Calendar
                    mode="single"
                    selected={filters.createdAt ? new Date(filters.createdAt) : undefined}
                    onSelect={handleCreatedAtDate}
                    locale={ptBR}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* USUÁRIOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length === 0 && (
          <p className="text-center text-gray-400 mt-10">Nenhum usuário encontrado</p>
        )}
        {users.map((user) => (
          <div
            key={user.person.id}
            className="bg-white rounded-2xl border hover:shadow-xl transition duration-300 overflow-hidden group"
          >
            <div className="p-4 space-y-2">
              <h2 className="font-semibold text-lg text-gray-900">{user.person.fullName}</h2>
              <p className="text-sm text-gray-600">CPF: {user.person.cpf}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedUserId(user.person.id);
                }}
              >
                Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3 mt-10">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={!hasPreviousPage}
          className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          ← Anterior
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNextPage}
          className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Próxima →
        </button>
      </div>
      {selectedUserId && (
        <UserPanelModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      )}
    </div>
  );
}
