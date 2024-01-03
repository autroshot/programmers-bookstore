import 'dotenv/config';
import express from 'express';
import { checkSchema } from 'express-validator';
import { join as joinController } from './controllers/user';
import { handleValidationResult } from './middlewares';
import { form } from './validators/user';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('My Server');
});

app.post(
    '/users',
    checkSchema(form, ['body']),
    handleValidationResult,
    joinController
);
