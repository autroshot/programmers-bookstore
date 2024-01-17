import pool from '@maria-db';
import { DBErrorWrapper } from '@utils/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

const findOne = DBErrorWrapper(
    async (userId: number, bookId: number): Promise<Like | undefined> => {
        const sql = `
            SELECT "user_id" AS "userId", "book_id" AS "bookId" 
            FROM "likes" 
            WHERE "user_id" = :userId AND "book_id" = :bookId
            `;
        const values = { userId, bookId };

        const [likes] = await pool.execute<Array<Like>>(sql, values);

        return likes[0];
    }
);

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

interface Like extends RowDataPacket {
    userId: number;
    bookId: number;
}

export { create, findOne, remove };
