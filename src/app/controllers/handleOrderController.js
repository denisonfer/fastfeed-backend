import * as Yup from 'yup';
import { formatISO } from 'date-fns';
import Orders from '../models/orders';
import Recipients from '../models/recipients';
import Couriers from '../models/couriers';

class HandleOrderController {
  async index(req, res) {
    // Validação do entregador
    const courier = await Couriers.findByPk(req.params.id);

    if (!courier) {
      return res.status(401).json('Entregador não localizado!');
    }

    // Busca encomendas disponiveis para retirada por entregador.
    const listOrders = await Orders.findAll({
      where: { couriers_id: courier.id, canceled_at: null },
    });

    return res.json(listOrders);
  }

  async avaliableOrder(req, res) {
    // Validação do entregador
    const courier = await Couriers.findByPk(req.params.id);

    if (!courier) {
      return res.status(401).json('Entregador não localizado!');
    }

    // Validação da encomenda
    const checkOrder = await Orders.findByPk(req.params.idOrder);

    if (!checkOrder) {
      return res.status(401).json('Encomenda não localizada!');
    }

    const currentDate = formatISO(new Date(), { representation: 'date' });

    // Verifica se a encomenda está disponível para retirada
    if (checkOrder.start_date !== null) {
      return res.status(401).json('Encomenda já retirada');
    }
    if (checkOrder.canceled_at !== null) {
      return res.status(401).json('Encomenda foi cancelada');
    }
    if (checkOrder.end_date !== null) {
      return res.status(401).json('Encomenda já foi entregue');
    }

    // Entregador faz a retirada do produto.
    await checkOrder.update({
      start_date: currentDate,
    });

    // Só é permitido 5 retiradas por dia
    const checkAvaliable = await Orders.findAll({
      where: { start_date: currentDate },
    });
    const retiradas_hoje = checkAvaliable.length;

    if (retiradas_hoje > 5) {
      await checkOrder.update({
        start_date: null,
      });
      return res.status(401).json('Limite de retiradas diária alcançada');
    }

    return res.json({
      data_atual: currentDate,
      msg: 'Encomenda retirada com sucesso!',
      checkOrder,
      retiradas_hoje,
    });
  }

  async deliveredOrder(req, res) {
    // Validação do entregador
    const courier = await Couriers.findByPk(req.params.id);

    if (!courier) {
      return res.status(401).json('Entregador não localizado!');
    }

    // Validação da encomenda
    const checkOrder = await Orders.findByPk(req.params.idOrder);

    if (!checkOrder) {
      return res.status(401).json('Encomenda não localizada!');
    }

    // Verifica se a encomenda está disponível para entrega
    if (checkOrder.canceled_at !== null) {
      return res.status(401).json('Encomenda foi cancelada');
    }
    if (checkOrder.end_date !== null) {
      return res.status(401).json('Encomenda já foi entregue');
    }

    // Entregador faz a entrega do produto.
    await checkOrder.update({ end_date: new Date() });

    return res.json({
      msg: 'Encomenda entregue com sucesso!',
      checkOrder,
    });
  }
}

export default new HandleOrderController();
