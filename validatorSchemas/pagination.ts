import type { Schema } from 'express-validator';

const pagination: Schema = {
    page: {
        optional: true,
        isInt: { options: { min: 1, allow_leading_zeroes: false } },
        toInt: true,
    },
    limit: {
        optional: true,
        isInt: { options: { min: 1, allow_leading_zeroes: false } },
        toInt: true,
    },
};

export default pagination;
