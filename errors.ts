class AuthError extends Error {
    constructor(message?: string) {
        super();
        this.name = 'AuthError';
        this.message = message ?? '';
    }
}

class ValidationError extends Error {
    constructor() {
        super();
        this.name = 'ValidationError';
    }
}

class DBError extends Error {
    errorNo: number;

    constructor(errno: number) {
        super();
        this.name = 'DBError';
        this.errorNo = errno;
    }
}

export { AuthError, DBError, ValidationError };
