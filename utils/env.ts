function getEnvValue(key: string): string {
    const value = process.env[key];

    if (value === undefined) {
        throw Error(`${key}에 대응되는 환경 변수 값이 없습니다.`);
    }
    return value;
}

export { getEnvValue };
