import type { Pagination } from '@services/book';

function toDBPagination(page: number, limit: number): Pagination {
    const offset = (page - 1) * limit;

    return { offset, limit };
}

export { toDBPagination };
