import { Calendar } from '@/components/ui/calendar';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { EventsFiltersType } from '../types/events-filters.type';

type FiltersFormProps = {
  filters: EventsFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<EventsFiltersType>>;
};

export function FiltersForm({ filters, setFilters }: FiltersFormProps) {
  const startDate = filters.startAt ? new Date(filters.startAt) : undefined;
  const endDate = filters.endAt ? new Date(filters.endAt) : undefined;

  const [showStartCalendar, setShowStartCalendar] = useState<boolean>(false);
  const [showEndCalendar, setShowEndCalendar] = useState<boolean>(false);

  const clearFilters = () => {
    setFilters({
      title: '',
      city: '',
      status: '',
      startAt: '',
      endAt: '',
    });

    setShowStartCalendar(false);
    setShowEndCalendar(false);
  };

  const formatToISODate = (date: Date) =>
    new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  const handleStartDate = (date?: Date) => {
    setShowStartCalendar(false);
    setFilters((prev) => ({
      ...prev,
      startAt: date ? formatToISODate(date) : '',
    }));
  };
  const handleEndDate = (date?: Date) => {
    setShowEndCalendar(false);
    setFilters((prev) => ({
      ...prev,
      endAt: date ? formatToISODate(date) : '',
    }));
  };

  const formatDate = (date: Date) => date.toLocaleDateString('pt-BR') || '';

  return (
    <div className="max-w-6xl mx-auto mt-6 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
          <p className="text-sm text-gray-500">Refine os eventos por título, cidade ou período</p>
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
          {/* TITLE */}
          <input
            type="text"
            placeholder="🔍 Buscar por título..."
            value={filters.title ?? ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, title: e.target.value }))}
            className="border rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* CIDADE */}
          <input
            type="text"
            placeholder="📍 Cidade..."
            value={filters.city ?? ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
            className="border rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* PERÍODO */}
          <div className="flex gap-2">
            {/* DATA INICIAL */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setShowStartCalendar((prev) => !prev)}
                className="w-full border rounded-xl px-3 py-2 text-left bg-white hover:border-blue-400 transition"
              >
                {startDate ? formatDate(startDate) : 'Início'}
              </button>

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
            </div>

            {/* DATA FINAL */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setShowEndCalendar((prev) => !prev)}
                className="w-full border rounded-xl px-3 py-2 text-left bg-white hover:border-blue-400 transition"
              >
                {endDate ? formatDate(endDate) : 'Fim'}
              </button>

              {showEndCalendar && (
                <div className="absolute z-20 mt-2 bg-white shadow-xl rounded-xl p-4">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDate}
                    locale={ptBR}
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RESUMO */}
        <div className="text-sm text-gray-500">
          {startDate && endDate ? (
            <span>
              Mostrando eventos de{' '}
              <span className="font-medium text-gray-700">{formatDate(startDate)}</span> até{' '}
              <span className="font-medium text-gray-700">{formatDate(endDate)}</span>
            </span>
          ) : (
            <span>Selecione um período para filtrar</span>
          )}
        </div>
      </div>
    </div>
  );
}
