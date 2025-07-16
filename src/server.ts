import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Teste AiQfome',
            version: '1.0.0',
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api`,
                description: 'Servidor Homolog'
            }
        ]
    },
    apis: ['./src/routes/*.ts'],

};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use(helmet());
app.use(cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Muitas requisições foram feitas deste IP, tente novamente mais tarde',
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Houve um erro no servidor!' });
});
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta - ${PORT}`);
    console.log(`Documentação em : http://localhost:${PORT}/api-docs`);
});

export default app;