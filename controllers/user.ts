import { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import { ResultSetHeader } from 'mysql2';
import { DBError } from '../errors';
import pool from '../maria-db';

const join: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { email, password } = matchedData(req) as {
        email: string;
        password: string;
    };

    try {
        const result = await pool.execute(
            'INSERT INTO `programmers_bookstore`.`users` (`email`, `password`) VALUES (:email, :password)',
            { email, password }
        );
        console.log(result);

        res.status(201).end();
    } catch (err) {
        if (assertMySQLError(err)) {
            console.error(err);
            throw new DBError(err.errno);
        }
        throw err;
    }
});

const update: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { email, password } = matchedData(req) as {
        email: string;
        password: string;
    };

    try {
        const sql =
            'UPDATE `programmers_bookstore`.`users` SET `password` = :password WHERE (`email` = :email)';
        const result = await pool.execute<ResultSetHeader>(sql, {
            email,
            password,
        });
        console.log(result);

        if (result[0].affectedRows >= 1) {
            res.status(204).end();
            return;
        }
        res.status(422).end();
        return;
    } catch (err) {
        if (assertMySQLError(err)) {
            console.error(err);
            throw new DBError(err.errno);
        }
        throw err;
    }
});

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

export { join, update };
