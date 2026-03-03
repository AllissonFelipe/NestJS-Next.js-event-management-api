export class PaginationResultInterface<T> {
  items: T[];
  meta: {
    page?: number;
    limit?: number;
    total: number;
    totalPages?: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
  };
}
