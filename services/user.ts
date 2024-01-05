import { FieldPacket, ResultSetHeader } from 'mysql2';
import pool from '../maria-db';
import { DBErrorWrapper } from '../utils/db';

interface createForm {
    email: string;
    password: string;
}

const create = DBErrorWrapper(
    async ({ email, password }: createForm): Promise<void> => {
        const sql =
            'INSERT INTO `users` (`email`, `password`) VALUES (:email, :password)';
        const values = { email, password };

        await pool.execute(sql, values);
    }
);

const update = DBErrorWrapper(
    async ({
        email,
        password,
    }: createForm): Promise<[ResultSetHeader, FieldPacket[]]> => {
        const sql =
            'UPDATE `users` SET `password` = :password WHERE (`email` = :email)';
        const values = { email, password };

        return await pool.execute<ResultSetHeader>(sql, values);
    }
);

export { create, update };
