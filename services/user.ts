import { FieldPacket, ResultSetHeader } from 'mysql2';
import pool from '../maria-db';
import { DBErrorWrapper } from '../utils/db';

interface createForm {
    email: string;
    password: string;
}

async function create({ email, password }: createForm): Promise<void> {
    const sql =
        'INSERT INTO `users` (`email`, `password`) VALUES (:email, :password)';
    const values = { email, password };
    const result = await pool.execute(sql, values);
    console.log(result);
}

async function update({
    email,
    password,
}: createForm): Promise<[ResultSetHeader, FieldPacket[]]> {
    const sql =
        'UPDATE `users` SET `password` = :password WHERE (`email` = :email)';
    const values = { email, password };
    const result = await pool.execute<ResultSetHeader>(sql, values);
    console.log(result);

    return result;
}

const wrappedCreate = DBErrorWrapper(create);
const wrappedUpdate = DBErrorWrapper(update);

export { wrappedCreate as create, wrappedUpdate as update };
