import {
    create as createService,
    update as updateService,
} from '@services/user';
import { createSalt, hashPassword } from '@utils/encryption';
import type { RequestHandlers } from '@utils/request-handler';
import { createRequestHandlers } from '@utils/request-handler';
import { form as formSchema } from '@validatorSchemas/user';
import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { checkSchema, matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const join: RequestHandlers = createRequestHandlers({
    validations: [checkSchema(formSchema, ['body'])],
    requestHandler: async (req, res) => {
        const { email, password } = matchedData(req) as {
            email: string;
            password: string;
        };

        const salt = createSalt();
        const hashedPassword = hashPassword(password, salt);
        await createService({ email, password: hashedPassword, salt });

        res.status(StatusCodes.CREATED).end();
    },
});

const update: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { email, password } = matchedData(req) as {
        email: string;
        password: string;
    };

    const salt = createSalt();
    const hashedPassword = hashPassword(password, salt);
    const isSuccess = await updateService({
        email,
        password: hashedPassword,
        salt,
    });

    if (!isSuccess) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
        return;
    }
    res.status(StatusCodes.NO_CONTENT).end();
    return;
});

export { join, update };
