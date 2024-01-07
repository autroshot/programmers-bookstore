import jwt from 'jsonwebtoken';

function createToken(
    payload: string | object | Buffer,
    expiresIn: jwt.SignOptions['expiresIn']
) {
    if (typeof process.env.JWT_SECRET_KEY !== 'string')
        throw Error('필요한 환경 변수가 없습니다.');

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: expiresIn,
        issuer: process.env.JWT_ISSUER,
    });
}

export { createToken };
