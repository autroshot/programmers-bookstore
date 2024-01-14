import type { Schema } from 'express-validator';

const pagination: Schema = {
    page: {
        default: { options: '1' },
        isInt: { options: { min: 1, allow_leading_zeroes: false } },
        toInt: true,
    },
    limit: {
        default: { options: '5' },
        isInt: { options: { min: 1, max: 100, allow_leading_zeroes: false } },
        toInt: true,
    },
};

export default pagination;
