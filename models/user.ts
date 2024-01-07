import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
    id: number;
    email: string;
    password: string;
    salt: string;
}

export type { User };
