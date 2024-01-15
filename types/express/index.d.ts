declare namespace Express {
    interface Request {
        authenticatedId?: number;
        authenticatedEmail?: string;
    }
}
