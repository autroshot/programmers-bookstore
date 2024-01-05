import { FieldPacket, ResultSetHeader } from 'mysql2';
import { DBError } from '../errors';
import pool from '../maria-db';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DBErrorWrapper<Func extends (...args: any[]) => Promise<any>>(
    service: Func
): (...args: Parameters<Func>) => Promise<Awaited<ReturnType<Func>>> {
    const wrappedService = async (
        ...args: Parameters<Func>
    ): Promise<Awaited<ReturnType<Func>>> => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const result = await service(...args);

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return result;
        } catch (err) {
            if (assertMySQLError(err)) {
                console.error(err);
                throw new DBError(err.errno);
            }
            throw err;
        }
    };
    return wrappedService;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assertMySQLError(err: any): err is MySQLError {
    return (
        'code' in err &&
        'errno' in err &&
        'sql' in err &&
        'sqlState' in err &&
        'sqlMessage' in err
    );
}

interface MySQLError extends Error {
    code: string;
    errno: number;
    sql: string;
    sqlState: string;
    sqlMessage: string;
}

const wrappedCreate = DBErrorWrapper(create);
const wrappedUpdate = DBErrorWrapper(update);

export { wrappedCreate as create, wrappedUpdate as update };
