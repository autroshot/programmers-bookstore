import crypto from 'node:crypto';

function createSalt() {
    return crypto.randomBytes(20).toString('base64');
}

function hashPassword(password: crypto.BinaryLike, salt: crypto.BinaryLike) {
    return crypto
        .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
        .toString('base64');
}

export { createSalt, hashPassword };
