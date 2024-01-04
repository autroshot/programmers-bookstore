import { ParamSchema, Schema } from 'express-validator';

const email: ParamSchema = { trim: true, notEmpty: true, isEmail: true };
const password: ParamSchema = {
    trim: true,
    notEmpty: true,
    isLength: { options: { min: 8, max: 20 } },
};

const form: Schema = { email, password };

export { form };