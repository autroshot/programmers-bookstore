import pool from '@maria-db';
import { DBErrorWrapper } from '@utils/db';
import type { RowDataPacket } from 'mysql2';

const findMany = DBErrorWrapper(
    async (
        categoryId?: number,
        pagination: Pagination = { offset: 0, limit: 5 }
    ): Promise<Array<SimpleBook>> => {
        let sql = `
            SELECT "id", "title", "author", "price", "summary", "image_url" AS "imageUrl" 
            FROM "books"
            `;
        const values = {
            categoryId,
            offset: pagination.offset,
            limit: pagination.limit,
        };

        if (categoryId !== undefined) {
            sql = sql.concat(' WHERE "books"."category_id" = :categoryId');
        }

        sql = sql.concat(' LIMIT :limit OFFSET :offset');

        const [books] = await pool.execute<Array<SimpleBook>>(sql, values);

        return books;
    }
);

const findOne = DBErrorWrapper(
    async (id: number): Promise<DetailedBook | undefined> => {
        const sql = `
            SELECT 
                "books"."id", 
                "categories"."name" AS "category", 
                "formats"."name" AS "format", 
                "books"."isbn", "books"."title", 
                "books"."author", 
                "books"."pages", 
                "books"."price", 
                "books"."publication_date" AS "publicationDate", 
                "books"."summary", 
                "books"."description", 
                "books"."table_of_contents" AS "tableOfContents", 
                "books"."image_url" AS "imageUrl" 
            FROM "books" 
            LEFT JOIN "categories" 
                ON "categories"."id" = "books"."category_id" 
            LEFT JOIN "formats" 
                ON "formats"."id" = "books"."format_id" 
            WHERE "books"."id" = :id
            `;
        const values = { id };

        const [books] = await pool.execute<Array<DetailedBook>>(sql, values);

        return books[0];
    }
);

interface SimpleBook extends RowDataPacket {
    id: number;
    title: string;
    author: string;
    price: number;
    summary: string | null;
    imageUrl: string | null;
}

interface DetailedBook extends SimpleBook {
    category: string;
    format: string;
    isbn: string;
    pages: number;
    publicationDate: string;
    description: string | null;
    tableOfContents: string | null;
}

interface Pagination {
    offset: number;
    limit: number;
}

export { findMany, findOne };
export type { Pagination };
