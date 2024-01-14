import type { Schema } from 'express-validator';

const isNew: Schema = {
    isNew: {
        default: { options: 'false' },
        isBoolean: true,
        toBoolean: true,
    },
};

export { isNew };
