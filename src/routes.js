import { Router } from 'express';

import UserController from './app/controllers/userController';
import SessionController from './app/controllers/sessionController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();

// Rota para criar usuário
routes.post('/usuarios', UserController.store);

// Rotas para sessão
routes.post('/sessao', SessionController.store);

routes.use(authMiddleware);

// Rotas para editar usuário
routes.put('/usuarios', UserController.update);

export default routes;
