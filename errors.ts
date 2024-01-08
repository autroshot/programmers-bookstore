class AuthError extends Error {
    constructor() {
        super();
        this.name = 'AuthError';
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
