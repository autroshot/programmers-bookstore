import pool from '@maria-db';
import { DBErrorWrapper } from '@utils/db';
import type { ResultSetHeader } from 'mysql2';

const create = DBErrorWrapper(
    async (userId: number, bookId: number): Promise<void> => {
        const sql = `
            INSERT INTO "likes" ("user_id", "book_id") 
            VALUES (:userId, :bookId)
            `;
        const values = { userId, bookId };

        await pool.execute(sql, values);
    }
);

const remove = DBErrorWrapper(
    async (userId: number, bookId: number): Promise<boolean> => {
        const sql = `
            DELETE FROM "likes" 
            WHERE ("user_id" = :userId) AND ("book_id" = :bookId)
            `;
        const values = { userId, bookId };

        const [resultSetHeader] = await pool.execute<ResultSetHeader>(
            sql,
            values
        );
        if (resultSetHeader.affectedRows === 0) return false;
        return true;
    }
);

export { create, remove };
