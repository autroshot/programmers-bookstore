import pool from '@maria-db';
import { DBErrorWrapper } from '@utils/db';

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

export { create };
