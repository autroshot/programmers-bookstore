import { DBError } from '../errors';

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

export { DBErrorWrapper };
