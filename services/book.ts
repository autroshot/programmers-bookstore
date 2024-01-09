import pool from '@maria-db';
import { DBErrorWrapper } from '@utils/db';
import type { RowDataPacket } from 'mysql2';

const findMany = DBErrorWrapper(
    async (): Promise<Array<FindManyResult> | undefined> => {
        const sql =
            'SELECT `id`, `title`, `author`, `price`, `summary`, `image_url` AS `imageUrl` FROM `books`;';

        const [books] = await pool.execute<Array<FindManyResult>>(sql);

        return books;
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

export { findMany };
