import pool from '@maria-db';
import { DBErrorWrapper } from '@utils/db';
import type { RowDataPacket } from 'mysql2';

const findMany = DBErrorWrapper(
    async (): Promise<Array<FindManyResult> | undefined> => {
        const sql = `
            SELECT "id", "title", "author", "price", "summary", "image_url" AS "imageUrl" 
            FROM "books"
            `;

        const [books] = await pool.execute<Array<FindManyResult>>(sql);

        return books;
    }
);

const findOne = DBErrorWrapper(
    async (id: number): Promise<FindOneResult | undefined> => {
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

        const [books] = await pool.execute<Array<FindOneResult>>(sql, values);

        return books[0];
    }
);

interface FindManyResult extends RowDataPacket {
    id: number;
    title: string;
    author: string;
    price: number;
    summary: string | null;
    imageUrl: string | null;
}

interface FindOneResult extends RowDataPacket {
    id: number;
    category: string;
    format: string;
    isbn: string;
    title: string;
    author: string;
    pages: number;
    price: number;
    publicationDate: string;
    summary: string | null;
    description: string | null;
    tableOfContents: string | null;
    imageUrl: string | null;
}

export { findMany, findOne };
