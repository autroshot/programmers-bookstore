import jwt from 'jsonwebtoken';
import { getEnvValue } from './env';

function createToken(
    payload: string | object | Buffer,
    expiresIn: jwt.SignOptions['expiresIn']
) {
    const SECRET_KEY = getEnvValue('JWT_SECRET_KEY');
    const ISSUER = getEnvValue('JWT_ISSUER');

    return jwt.sign(payload, SECRET_KEY, {
        expiresIn: expiresIn,
        issuer: ISSUER,
    });
}

function verifyToken(token: string) {
    const SECRET_KEY = getEnvValue('JWT_SECRET_KEY');
    const ISSUER = getEnvValue('JWT_ISSUER');

    return jwt.verify(token, SECRET_KEY, { issuer: ISSUER });
}

export { createToken, verifyToken };
