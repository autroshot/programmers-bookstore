import pool from '@maria-db';
import { DBErrorWrapper } from '@utils/db';
import type { RowDataPacket } from 'mysql2';

const findMany = DBErrorWrapper(async (): Promise<Array<Category>> => {
    const sql = `
            SELECT "id", "name" 
            FROM "categories"
            `;

    const [categories] = await pool.execute<Array<Category>>(sql);

    return categories;
});

const findOne = DBErrorWrapper(
    async (id: number): Promise<Category | undefined> => {
        const sql = `
            SELECT "id", "name" 
            FROM "categories"
            WHERE "id" = :id
            `;
        const values = { id };

        const [categories] = await pool.execute<Array<Category>>(sql, values);

        return categories[0];
    }
);

interface Category extends RowDataPacket {
    id: number;
    name: string;
}

export { findMany, findOne };
