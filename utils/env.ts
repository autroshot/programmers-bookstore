function getEnvValue(key: key): string {
    const value = process.env[key];

    if (value === undefined) {
        throw Error(`${key}에 대응되는 환경 변수 값이 없습니다.`);
    }
    return value;
}

type key =
    | 'SERVER_PORT'
    | 'DB_HOST'
    | 'DB_PORT'
    | 'DB_USER'
    | 'DB_PASSWORD'
    | 'DB_DATABASE'
    | 'JWT_SECRET_KEY'
    | 'JWT_ISSUER';

export { getEnvValue };
