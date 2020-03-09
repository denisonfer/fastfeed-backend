import { Router } from 'express';

import UserController from './app/controllers/userController';
import SessionController from './app/controllers/sessionController';
import RecipientsController from './app/controllers/recipientsController';
import CouriersController from './app/controllers/couriersController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();

// Rota para criar usuário
routes.post('/usuarios', UserController.store);

// Rota para sessão
routes.post('/sessao', SessionController.store);

routes.use(authMiddleware);

// Rotas para usuário
routes.put('/usuarios', UserController.update);

// Rotas para destinatário
routes.post('/destinatarios', RecipientsController.store);
routes.put('/destinatarios/:id', RecipientsController.update);

// Rotas para entregador
routes.post('/entregadores', CouriersController.store);
routes.put('/entregadores/:id', CouriersController.update);
routes.delete('/entregadores/:id', CouriersController.delete);

export default routes;
