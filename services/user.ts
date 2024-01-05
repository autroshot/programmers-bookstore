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
        const result = await pool.execute(sql, values);
        console.log(result);
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
        const result = await pool.execute<ResultSetHeader>(sql, values);
        console.log(result);

        return result;
    }
);

export { create, update };
