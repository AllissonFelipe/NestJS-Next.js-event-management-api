'use client';

import { EventsForm } from './components/EventsForm';
import { FiltersForm } from './components/FiltersForm';
import { PaginationForm } from './components/PaginationForm';
import useFindEventsList from './hooks/use-find-events-list';

export default function EventsPage() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/events`;
  const LIMIT_PER_PAGE = 9;
  const eventsHook = useFindEventsList(url, LIMIT_PER_PAGE);

  return (
    <>
      <header></header>
      <main>
        <div>
          {/* FORMULÁRIO DE FILTROS */}
          <FiltersForm filters={eventsHook.filters} setFilters={eventsHook.setFilters} />
          {/* LISTA DE EVENTOS */}
          <EventsForm
            events={eventsHook.events}
            loading={eventsHook.loading}
            error={eventsHook.error}
          />
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
