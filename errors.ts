class AuthenticationError extends Error {
    constructor(message?: string) {
        super();
        this.name = this.constructor.name;
        this.message = message ?? '';
    }
}

class AuthorizationError extends Error {
    constructor(message?: string) {
        super();
        this.name = this.constructor.name;
        this.message = message ?? '';
    }
}

class ValidationError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
    }
}

class DBError extends Error {
    errorNo: number;

    constructor(errno: number) {
        super();
        this.name = this.constructor.name;
        this.errorNo = errno;
    }
}

export { AuthenticationError, AuthorizationError, DBError, ValidationError };
