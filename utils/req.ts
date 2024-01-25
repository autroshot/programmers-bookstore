import type { Request } from 'express';

function getId(req: Request): number {
    const id = req.authenticatedId;

    if (typeof id !== 'number')
        throw new Error('req에 인증된 아이디가 없습니다.');
    return id;
}

export { getId };
