type PaginationFormProps = {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export function PaginationForm({ hasPreviousPage, hasNextPage, setPage }: PaginationFormProps) {
  return (
    <>
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
  );
}
