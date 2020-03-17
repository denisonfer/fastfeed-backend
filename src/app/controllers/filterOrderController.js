import * as Yup from 'yup';
import Orders from '../models/orders';
import Recipients from '../models/recipients';
import Couriers from '../models/couriers';
import Mail from '../../lib/mail';

class FilterOrderController {
  async index(req, res) {
    // Validação do entregador
    const courier = await Couriers.findByPk(req.params.id);

    if (!courier) {
      return res.status(401).json('Entregador não localizado!');
    }

    // Busca encomenda para o entregador ONDE esteja entregue.
    const listOrders = await Orders.findAll({
      where: { couriers_id: courier.id, canceled_at: null },
    });

    return res.json(listOrders);
  }
}

export default new FilterOrderController();
