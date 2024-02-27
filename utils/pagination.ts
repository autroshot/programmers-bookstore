import type { Pagination } from '@services/book';

function toDBPagination(page: number, limit: number): Pagination {
    const offset = (page - 1) * limit;

    return { offset, limit };
}

function calculateTotalPages(count: number, limit: number): number {
    return Math.ceil(count / limit);
}

export { calculateTotalPages, toDBPagination };
