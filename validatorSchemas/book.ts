import type { Schema } from 'express-validator';

const isNew: Schema = {
    'is-new': {
        default: { options: 'false' },
        isBoolean: true,
        toBoolean: true,
    },
};

export { isNew };
