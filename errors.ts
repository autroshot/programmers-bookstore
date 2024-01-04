class ValidationError extends Error {
    constructor() {
        super();
        this.name = 'ValidationError';
    }
}

export { ValidationError };
