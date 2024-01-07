import pool from '@maria-db';
import { User } from '@models/user';
import { DBErrorWrapper } from '@utils/db';
import { FieldPacket, ResultSetHeader } from 'mysql2';

const create = DBErrorWrapper(
    async ({ email, password, salt }: createForm): Promise<void> => {
        const sql =
            'INSERT INTO `users` (`email`, `password`, `salt`) VALUES (:email, :password, :salt)';
        const values = { email, password, salt };

        await pool.execute(sql, values);
    }
);

const findOne = DBErrorWrapper(
    async (email: User['email']): Promise<User | undefined> => {
        const sql =
            'SELECT `id`, `email`, `password`, `salt` FROM `users` WHERE (`email` = :email)';
        const values = { email };

        const [users] = await pool.execute<Array<User>>(sql, values);
        return users[0];
    }
);

const update = DBErrorWrapper(
    async ({
        email,
        password,
        salt,
    }: createForm): Promise<[ResultSetHeader, Array<FieldPacket>]> => {
        const sql =
            'UPDATE `users` SET `password` = :password, `salt` = :salt WHERE (`email` = :email)';
        const values = { email, password, salt };

        return await pool.execute<ResultSetHeader>(sql, values);
    }
);

type createForm = Pick<User, 'email' | 'password' | 'salt'>;

export { create, findOne, update };
