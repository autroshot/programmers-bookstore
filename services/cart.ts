import pool from '@maria-db';
import { DBErrorWrapper } from '@utils/db';
import type { RowDataPacket } from 'mysql2';

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

interface CartItem extends RowDataPacket {
    id: number;
    title: string;
    price: number;
    summary?: string;
    imageUrl?: string;
    count: number;
}

export { findMany };
