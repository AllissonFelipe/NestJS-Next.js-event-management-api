import { useEffect, useState } from 'react';
import { EventsFiltersType } from '../types/events-filters.type';
import { Events } from '../types/events.type';

export default function useFindEventsList(urlFrontEnd: string, limitPerPage: number) {
  // EVENTOS E FILTROS
  const [events, setEvents] = useState<Events[]>([]);
  const [filters, setFilters] = useState<EventsFiltersType>({
    title: '',
    city: '',
    status: '',
    startAt: '',
    endAt: '',
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // PAGINAÇÃO
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  // LOADING
  const [loading, setLoading] = useState(false);

  // DEBOUNCE NOS FILTROS
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  // FETCH
  useEffect(() => {
    const url = new URL(urlFrontEnd);
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(limitPerPage));

    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
    const controller = new AbortController();

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(url.toString(), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        });
        const data = await res.json();
        setEvents(data.items ?? []);
        setTotalPages(data.meta.totalPages ?? 1);
        setHasNextPage(data.meta.hasNextPage);
        setHasPreviousPage(data.meta.hasPreviousPage);
      } catch (err) {
        if (err instanceof Error) {
          console.error('Erro ao buscar evento:', err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [page, debouncedFilters, limitPerPage, urlFrontEnd]);
  return {
    events,
    loading,
    filters,
    setFilters,
    page,
    setPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
}
