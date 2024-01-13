import type { Schema } from 'express-validator';

const id: Schema = {
    id: {
        isInt: { options: { min: 1, allow_leading_zeroes: false } },
        toInt: true,
    },
};

export default id;
