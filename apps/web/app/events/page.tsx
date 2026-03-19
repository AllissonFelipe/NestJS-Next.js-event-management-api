'use client';

import { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';

type Event = {
  id: string;
  title: string;
  description: string;
  status: string;
  startAt: string;
  address: {
    number: string;
    city: string;
  };
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState(false);

  // FILTROS DE BUSCA
  const [filters, setFilters] = useState({
    title: '',
    status: '',
    startAt: '',
    endAt: '',
    city: '',
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // FILTRO PARA DATA DE INÍCIO E DATA FINAL DO EVENTO
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const handleStartDate = (startDate: Date | undefined) => {
    setStartDate(startDate);
    setShowStartCalendar(false);
    setFilters((prev) => ({
      ...prev,
      startAt: startDate ? startDate.toISOString().split('T')[0] : '',
    }));
  };
  const handleEndDate = (endDate: Date | undefined) => {
    setEndDate(endDate);
    setShowEndCalendar(false);
    setFilters((prev) => ({
      ...prev,
      endAt: endDate ? endDate.toISOString().split('T')[0] : '',
    }));
  };

  // PAGINAÇÃO
  const [page, setPage] = useState(1);
  const LIMIT_POR_PAGE = 9;
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // USE EFFECT PARA TER DEBOUNCE EM BUSCA COM FILTROS
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const url = new URL('http://localhost:3000/events');
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(LIMIT_POR_PAGE));

    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
    const controller = new AbortController();
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${url}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        console.log('RESPONSE:', data);

        setEvents(data.items ?? []);
        setTotalPages(data.meta.totalPages ?? 1);
        setHasNextPage(data.meta.hasNextPage);
        setHasPreviousPage(data.meta.hasPreviousPage);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== 'AbortError') {
            console.error('Erro ao buscar eventos: ', err.message);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
    return () => {
      controller.abort();
    };
  }, [page, debouncedFilters]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white border-b px-6 py-5 space-y-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Eventos</h1>

          {/* FILTROS */}
          <div className="bg-gray-50 border rounded-2xl p-4 mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* TITLE */}
            <input
              type="text"
              placeholder="🔍 Buscar por título..."
              value={filters.title}
              onChange={(e) => setFilters((prev) => ({ ...prev, title: e.target.value }))}
              className="border rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* CIDADE */}
            <input
              type="text"
              placeholder="📍 Cidade..."
              value={filters.city}
              onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
              className="border rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* DATAS */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Eventos no período</label>
              <div className="flex gap-2">
                {/* START */}
                <button
                  onClick={() => setShowStartCalendar((prev) => !prev)}
                  className="flex-1 border rounded-xl px-3 py-2 text-left bg-white hover:border-blue-400 transition"
                >
                  {startDate ? startDate.toLocaleDateString('pt-BR') : 'Data inicial'}
                </button>
                {/* END */}
                <button
                  onClick={() => {
                    if (!startDate) return;
                    setShowEndCalendar((prev) => !prev);
                  }}
                  className={`flex-1 border rounded-xl px-3 py-2 text-left transition
                                    ${
                                      !startDate
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white hover:border-blue-400'
                                    }`}
                >
                  {endDate ? endDate.toLocaleDateString('pt-BR') : 'Data final'}
                </button>
              </div>

              {/* RESUMO */}
              <span className="text-xs text-gray-500">
                {startDate && endDate
                  ? `${startDate.toLocaleDateString('pt-BR')} → ${endDate.toLocaleDateString('pt-BR')}`
                  : 'Selecione um período'}
              </span>

              {/* CALENDARIOS */}
              {showStartCalendar && (
                <div className="absolute z-20 mt-2 bg-white shadow-xl rounded-xl p-4">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDate}
                    locale={ptBR}
                  />
                </div>
              )}
              {showEndCalendar && startDate && (
                <div className="absolute z-20 mt-2 bg-white shadow-xl rounded-xl p-4">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDate}
                    locale={ptBR}
                    disabled={(date) => date < startDate}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* LISTA */}
      <main className="p-6 max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : events?.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">Nenhum evento encontrado</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border hover:shadow-xl transition duration-300 overflow-hidden group"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2"
                    alt={event.title}
                    width={800}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition"
                  />

                  <div className="p-4 space-y-2">
                    <h2 className="font-semibold text-lg text-gray-900">{event.title}</h2>

                    <p className="text-sm text-gray-500">📍 {event.address.city}</p>

                    <p className="text-sm text-gray-500">
                      📅 {new Date(event.startAt).toLocaleDateString('pt-BR')}
                    </p>

                    <span className="inline-block text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                      {event.status}
                    </span>

                    <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                      Ver detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINAÇÃO */}
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
          </>
        )}
      </main>
    </div>
  );
}
