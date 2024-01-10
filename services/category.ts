import pool from '@maria-db';
import { DBErrorWrapper } from '@utils/db';
import type { RowDataPacket } from 'mysql2';

const findMany = DBErrorWrapper(
    async (): Promise<Array<FindManyResult> | undefined> => {
        const sql = `
            SELECT "id", "name" 
            FROM "categories";
            `;

        const [categories] = await pool.execute<Array<FindManyResult>>(sql);

        return categories;
    }
);

interface FindManyResult extends RowDataPacket {
    id: number;
    name: string;
}

export { findMany };
