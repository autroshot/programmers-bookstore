import { getEnvValue } from '@utils/env';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: getEnvValue('DB_HOST'),
    port: Number(getEnvValue('DB_PORT')),
    user: getEnvValue('DB_USER'),
    password: getEnvValue('DB_PASSWORD'),
    database: getEnvValue('DB_DATABASE'),
    namedPlaceholders: true,
});

export default pool;
