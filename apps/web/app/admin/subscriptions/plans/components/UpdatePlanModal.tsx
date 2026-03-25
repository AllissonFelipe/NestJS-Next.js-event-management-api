import { Plan } from '@/app/admin/types/plan.type';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type UpdatePlanModalProps = {
  planId: string;
  onClose: () => void;
  onUpdated: () => void;
};

export default function UpdatePlanModal({ planId, onClose, onUpdated }: UpdatePlanModalProps) {
  const [error, setError] = useState<string>('');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>('');

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<number>();
  const [durationInDays, setDurationInDays] = useState<number>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/subscriptions/plans/${planId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price,
          durationInDays,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao atualizar plano.');
        return;
      }

      console.log('Plano atualizado: ', data);
      setPlan(data);
      const message = 'Plano atualizado com sucesso.';
      setSuccess(message);

      onUpdated();
      toast.success(message);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);

      const message =
        error instanceof Error
          ? 'Não foi possível atualizar o plano.'
          : 'Erro inesperado ao atualizar o plano.';

      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (plan) {
      setName(plan.name);
      setDescription(plan.description);
      setPrice(plan.price);
      setDurationInDays(plan.durationInDays);
    }
  }, [plan]);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch(`/api/admin/subscriptions/plans/${planId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || `Erro ao buscar plano`);
          setError(data.error || `Falha ao buscar plano.`);
          return;
        }
        if (data) {
          console.log('Plano: ', data);

          setPlan(data);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(`Erro ao buscar plano: ${error.message}`);
        } else {
          setError(`Erro desconhecido ao buscar plano: ${error}`);
        }
        console.log(`Erro ao buscar plano: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId]);

  if (loading) {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <p className="text-center text-gray-400 mt-10">Carregando plano...</p>
      </main>
    );
  }
  if (!plan) {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <p className="text-center text-gray-400 mt-10">Plano não encontrado</p>
      </main>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={onClose} // fecha ao clicar fora
    >
      <div
        className="bg-white p-6 rounded-xl w-[400px] relative"
        onClick={(e) => e.stopPropagation()} // impede fechar ao clicar dentro
      >
        <button className="absolute top-2 right-2" onClick={onClose}>
          ✕
        </button>

        <div className="p-4 space-y-4">
          <h2 className="font-semibold text-lg text-gray-900">Editar plano</h2>
          {success && <div className="bg-green-100 text-green-700 p-2 rounded">{success}</div>}
          {error && <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label htmlFor="description">Descrição</label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label htmlFor="price">Preço</label>
              <input
                type="number"
                id="price"
                value={price ?? ''}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label htmlFor="durationInDays">Duração</label>
              <input
                type="number"
                id="durationInDays"
                value={durationInDays ?? ''}
                onChange={(e) => setDurationInDays(Number(e.target.value))}
                className="border p-2 w-full"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-500 text-white p-2 rounded w-full"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>

              <button type="button" onClick={onClose} className="border p-2 rounded w-full">
                Voltar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
