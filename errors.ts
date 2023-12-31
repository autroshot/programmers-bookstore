class AuthenticationError extends Error {
    constructor(message?: string) {
        super();
        this.name = 'AuthenticationError';
        this.message = message ?? '';
    }
}

class AuthorizationError extends Error {
    constructor(message?: string) {
        super();
        this.name = 'AuthorizationError';
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

export { AuthenticationError, AuthorizationError, DBError, ValidationError };
