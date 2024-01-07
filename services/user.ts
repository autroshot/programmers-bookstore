import { FieldPacket, ResultSetHeader } from 'mysql2';
import pool from '../maria-db';
import { User } from '../models/user';
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

const findOne = DBErrorWrapper(
    async (email: User['email']): Promise<User | undefined> => {
        const sql =
            'SELECT `id`, `email`, `password` FROM `users` WHERE (`email` = :email)';
        const values = { email };

        const [users] = await pool.execute<User[]>(sql, values);
        return users[0];
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

export { create, findOne, update };
