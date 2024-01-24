import type { Schema } from 'express-validator';

const count: Schema = {
    count: {
        isInt: { options: { min: 1, allow_leading_zeroes: false } },
        toInt: true,
    },
};

export { count };
