'use client';

import { EventsForm } from './components/EventsForm';
import { FiltersForm } from './components/FiltersForm';
import { PaginationForm } from './components/PaginationForm';
import useEventsList from './hooks/use-events-list';

export default function EventsPage() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/events`;
  const LIMIT_PER_PAGE = 9;
  const eventsHook = useEventsList(url, LIMIT_PER_PAGE);

  return (
    <>
      <header></header>
      <main>
        <div>
          {/* FORMULÁRIO DE FILTROS */}
          <FiltersForm filters={eventsHook.filters} setFilters={eventsHook.setFilters} />
          {/* LISTA DE EVENTOS */}
          <EventsForm events={eventsHook.events} loading={eventsHook.loading} />
          {/* PAGINAÇÃO */}
          <PaginationForm
            hasPreviousPage={eventsHook.hasPreviousPage}
            hasNextPage={eventsHook.hasNextPage}
            setPage={eventsHook.setPage}
          />
        </div>
      </main>
    </>
  );
}
