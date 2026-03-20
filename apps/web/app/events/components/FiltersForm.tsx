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
    <>
      {/* FILTROS */}
      <div className="bg-gray-50 border rounded-2xl p-4 mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
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
        {/* DATAS */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Eventos no período</label>

          <div className="flex gap-2">
            {/* DATA INICIAL */}
            <div className="relative flex-1">
              <button
                type='button'
                onClick={() => {
                  setShowStartCalendar((prev) => !prev);
                }}
                className="w-full border rounded-xl px-3 py-2 text-left bg-white hover:border-blue-400 transition"
              >
                {startDate ? formatDate(startDate) : 'Data inicial'}
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
                type='button'
                onClick={() => {
                  setShowEndCalendar((prev) => !prev);
                }}
                className="w-full border rounded-xl px-3 py-2 text-left bg-white hover:border-blue-400 transition"
              >
                {endDate ? formatDate(endDate) : 'Data final'}
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

          {/* RESUMO */}
          <span className="text-xs text-gray-500">
            {startDate && endDate
              ? `${formatDate(startDate)} -> ${formatDate(endDate)}`
              : 'Selecione um período'}
          </span>
        </div>
      </div>
    </>
  );
}
