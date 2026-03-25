'use client';

import { Plan } from '@/app/admin/types/plan.type';
import { useEffect, useState } from 'react';
import UpdatePlanModal from './UpdatePlanModal';
import { toast } from 'sonner';
import CreatePlanModal from './CreatePlanModal';

export default function PlansForm() {
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [expandedPlanId, setExpandedPlanId] = useState(null);

  const handlePlanStatusChange = async (plan: Plan) => {
    try {
      setError('');
      setSuccess('');
      setLoadingPlanId(plan.id);
      const action = plan.isActive ? 'deactivate' : 'activate';
      const res = await fetch(`/api/admin/subscriptions/plans/${plan.id}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao atualizar status do plano.');
        return;
      }
      if (data) {
        console.log('Status do plano atualizado: ', data);
        const message = 'Status do plano atualizado com sucesso.';
        setSuccess(message);
        toast.success(message);
      }
      // Atualizando o estado local do objeto Plan[]
      setPlans(
        (prevPlan) =>
          prevPlan?.map((p) => (p.id === plan.id ? { ...p, isActive: !p.isActive } : p)) || null,
      );
    } catch (error) {
      console.error('Erro ao atualizar status do plano:', error);

      const message =
        error instanceof Error
          ? 'Não foi possível atualizar o status do plano.'
          : 'Erro inesperado ao atualizar o status do plano.';

      setError(message);
      toast.error(message);
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleDeletePlan = async (plan: Plan) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o plano "${plan.name}"?`);
    if (!confirmDelete) return;
    try {
      setError('');
      setLoadingPlanId(plan.id);

      const res = await fetch(`/api/admin/subscriptions/plans/${plan.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      let data = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok && res.status !== 204) {
        setError(data?.error || `Erro ao deletar plano.`);
        return;
      }

      setPlans((prev) => prev?.filter((p) => p.id !== plan.id) || null);
      console.log('Plano deletado com sucesso');
      const message = 'Plano deletado com sucesso';
      setSuccess(message);
      toast.success(message);
    } catch (error) {
      console.error('Erro ao deletar plano:', error);

      const message =
        error instanceof Error
          ? 'Não foi possível deletar o plano.'
          : 'Erro inesperado ao deletar o plano.';
      setError(message);
      toast.error(message);
    } finally {
      setLoadingPlanId(null);
    }
  };

  const fetchPlan = async () => {
    try {
      const res = await fetch(`/api/admin/subscriptions/plans`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Falha ao buscar planos.`);
        return;
      }
      if (data) {
        console.log('Planos: ', data);
        setPlans(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`Erro ao buscar planos: ${error.message}`);
      } else {
        setError(`Erro desconhecido ao buscar planos: ${error}`);
      }
      console.log(`Erro ao buscar planos: `, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  if (loading) {
    return <div className="text-center p-6">Carregando...</div>;
  }

  if (!plans || plans?.length === 0) {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <p className="text-center text-gray-400 mt-10">Nenhum plano encontrado</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      {error && <div className="text-center p-6">{error}</div>}

      <div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Criar Plano
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isExpanded = expandedPlanId === plan.id;

          return (
            <div
              key={plan.id}
              onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
              className="cursor-pointer bg-white rounded-2xl border hover:shadow-xl transition duration-300 overflow-hidden"
            >
              {/* HEADER */}
              <div>
                <h2>{plan.name}</h2>
                <p>R$ {plan.price}</p>
                <p>{plan.durationInDays} dias</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                >
                  {plan.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              {/* EXPANSÃO */}
              <div
                className={`transition-all duration-300 ${isExpanded ? 'max-h-96 p-5 pt-0' : 'max-h-0'} overflow-hidden`}
              >
                <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Descrição:</strong>
                    {plan.description}
                  </p>
                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlanId(plan.id);
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlanStatusChange(plan);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      {plan.isActive ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlan(plan);
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {selectedPlanId && (
        <UpdatePlanModal
          planId={selectedPlanId}
          onClose={() => setSelectedPlanId(null)}
          onUpdated={() => fetchPlan()}
        />
      )}
      {isCreateModalOpen && (
        <CreatePlanModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={() => fetchPlan()}
        />
      )}
    </main>
  );
}
