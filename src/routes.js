import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/userController';
import SessionController from './app/controllers/sessionController';
import RecipientsController from './app/controllers/recipientsController';
import CouriersController from './app/controllers/couriersController';
import AvatarsController from './app/controllers/avatarController';
import OrdersController from './app/controllers/ordersController';
import HandleOrderController from './app/controllers/handleOrderController';
import Delivery_problemsController from './app/controllers/delivery_problemController';

import authMiddleware from './app/middleware/auth';

import multerConfig from './config/multerConfig';

const routes = new Router();
const up_avatar = multer(multerConfig);

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

// Rota para upload do avatar
routes.post('/avatars', up_avatar.single('file'), AvatarsController.store);

// Rota para encomendas
routes.get('/encomendas', OrdersController.index);
routes.get('/encomendas/:id/entregadores/aberto', OrdersController.show);
routes.post('/encomendas', OrdersController.store);
routes.put('/encomendas/:id', OrdersController.update);
routes.delete('/encomendas/:id', OrdersController.delete);
routes.get(
  '/encomendas/:id/entregadores/entregue/:idOrder',
  HandleOrderController.deliveredOrder
);
routes.get(
  '/encomendas/:id/entregadores/disponivel/:idOrder',
  HandleOrderController.avaliableOrder
);

// Rota para relatar problemas nas encomendas
routes.get('/problemas', Delivery_problemsController.index);
routes.get('/problemas/:idOrder/encomenda', Delivery_problemsController.show);
routes.post('/problemas/:idOrder/encomenda', Delivery_problemsController.store);
routes.delete(
  '/problemas/:idProblem/cancelamento',
  Delivery_problemsController.delete
);

export default routes;
