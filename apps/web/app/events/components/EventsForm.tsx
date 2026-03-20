import { Events } from '../types/events.type';
import Image from 'next/image';

type EventsFormProps = {
  loading: boolean;
  events: Events[];
  error: string | null;
};

export function EventsForm({ events, loading, error }: EventsFormProps) {
  if (loading) {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <p className="text-center text-gray-500">Carregando...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <div className="text-center mt-10 space-y-2">
          <p className="text-red-500 font-medium">❌ Ocorreu um erro</p>
          <p className="text-sm text-gray-500">{error}</p>

          {/* BOTÃO OPCIONAL */}
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  if (!events || events.length === 0) {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <p className="text-center text-gray-400 mt-10">Nenhum evento encontrado</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
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
                Início: 📅 {new Date(event.startAt).toLocaleDateString('pt-BR')}
              </p>

              <p className="text-sm text-gray-500">
                Término: 📅 {new Date(event.endAt).toLocaleDateString('pt-BR')}
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
    </main>
  );
}
