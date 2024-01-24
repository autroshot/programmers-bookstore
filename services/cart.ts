import pool from '@maria-db';
import { DBErrorWrapper } from '@utils/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

const findMany = DBErrorWrapper(
    async (userId: number): Promise<Array<CartItem>> => {
        const sql = `
            SELECT "books"."id", "books"."title", "books"."price", "books"."summary", "books"."image_url" AS "imageUrl", "cart_items"."count" 
            FROM "cart_items" 
            LEFT JOIN "books" 
                ON "cart_items"."book_id" = "books"."id"
            WHERE "cart_items"."user_id" = :userId
            `;
        const values = { userId };

        const [cartItems] = await pool.execute<Array<CartItem>>(sql, values);

        return cartItems;
    }
);

/**
 * 생성이나 업데이트가 성공하면 `true`, 실패하면 `false`를 반환한다.
 */
const upsert = DBErrorWrapper(
    async ({ userId, bookId, count }: CreateForm): Promise<boolean> => {
        const sql = `
            INSERT INTO "cart_items" ("user_id", "book_id", "count") 
            VALUES (:userId, :bookId, :count) 
            ON DUPLICATE KEY UPDATE 
            "count" = :count
            `;
        const values = { userId, bookId, count };

        const [resultSetHeader] = await pool.execute<ResultSetHeader>(
            sql,
            values
        );

        if (resultSetHeader.affectedRows === 0) return false;
        return true;
    }
);

interface CartItem extends RowDataPacket {
    id: number;
    title: string;
    price: number;
    summary?: string;
    imageUrl?: string;
    count: number;
}

interface CreateForm {
    userId: number;
    bookId: number;
    count: number;
}

export { findMany, upsert };
