import { useState } from 'react';
import { toast } from 'sonner';

type CreatePlanModalProps = {
  onClose: () => void;
  onCreated: () => void;
};

function formatErrors(errors: string[]) {
  const messages: Record<string, string> = {
    'name should not be empty': 'O nome do plano é obrigatório.',
    'description should not be empty': 'A descrição é obrigatória.',
    'price must not be less than 0': 'O preço não pode ser negativo.',
    'price must be a number conforming to the specified constraints': 'Informe um preço válido.',
    'durationInDays must not be less than 1': 'A duração deve ser de pelo menos 1 dia.',
    'durationInDays must be a number conforming to the specified constraints':
      'Informe uma duração válida.',
    'isActive must be a boolean value': 'Selecione se o plano está ativo ou não.',
    'isActive should not be empty': 'Informe se o plano está ativo.',
  };

  return errors.map((err) => messages[err] || err);
}

export default function CreatePlanModal({ onClose, onCreated }: CreatePlanModalProps) {
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<number>();
  const [durationInDays, setDurationInDays] = useState<number>();
  const [isActive, setIsActive] = useState<boolean>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess('');

    try {
      setLoading(true);

      const res = await fetch(`/api/admin/subscriptions/plans`, {
        method: 'POST',
        headers: {},
        body: JSON.stringify({
          name,
          description,
          price,
          durationInDays,
          isActive,
        }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        const formatted = formatErrors(data.error || []);
        setError(formatted);
        return;
      }

      console.log('Plano criado: ', data);
      setSuccess(`Plano criado com sucesso.`);
      toast.success(`Plano criado com sucesso.`);
      onCreated();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);

      const message =
        error instanceof Error
          ? 'Não foi possível atualizar o plano.'
          : 'Erro inesperado ao atualizar o plano.';

      setError([message]);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
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
          <h2 className="font-semibold text-lg text-gray-900">Criar Plano</h2>
          {success && <div className="bg-green-100 text-green-700 p-2 rounded">{success}</div>}
          {error && Array.isArray(error) && (
            <div className="bg-red-100 text-red-700 p-2 rounded">
              <ul className="list-disc pl-5">
                {error.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

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

            <div>
              <label htmlFor="isActive">Plano Ativo?</label>
              <select
                id="isActive"
                value={isActive === undefined ? '' : String(isActive)}
                onChange={(e) => setIsActive(e.target.value === 'true')}
                className="border p-2 w-full"
              >
                <option value="">Selecione</option>
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white p-2 rounded w-full"
              >
                {loading ? 'Criando plano...' : 'Criar Plano'}
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
