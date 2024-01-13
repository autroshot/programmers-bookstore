import type { Pagination } from '@services/book';

function toDBPagination(
    page: number | undefined,
    limit: number | undefined
): Pagination | undefined {
    if (typeof page === 'undefined' || typeof limit === 'undefined')
        return undefined;
    const offset = (page - 1) * limit;
    return { offset, limit };
}

export { toDBPagination };
