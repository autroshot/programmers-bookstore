import pool from '@maria-db';
import { DBErrorWrapper } from '@utils/db';
import type { RowDataPacket } from 'mysql2';

const findMany = DBErrorWrapper(
    async (): Promise<Array<FindManyResult> | undefined> => {
        const sql = `
            SELECT "id", "name" 
            FROM "categories"
            `;

        const [categories] = await pool.execute<Array<FindManyResult>>(sql);

        return categories;
    }
);

const findOne = DBErrorWrapper(
    async (id: number): Promise<FindOneResult | undefined> => {
        const sql = `
            SELECT "id", "name" 
            FROM "categories"
            WHERE "id" = :id
            `;
        const values = { id };

        const [categories] = await pool.execute<Array<FindOneResult>>(
            sql,
            values
        );

        return categories[0];
    }
);

type FindManyResult = FindOneResult;
interface FindOneResult extends RowDataPacket {
    id: number;
    name: string;
}

export { findMany, findOne };
