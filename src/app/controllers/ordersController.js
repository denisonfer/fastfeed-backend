import * as Yup from 'yup';
import Orders from '../models/orders';

class OrdersController {
  async index(req, res) {
    const listOrders = await Orders.findAll();

    return res.json(listOrders);
  }

  async store(req, res) {
    // Validação dos dados recebidos
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      couriers_id: Yup.number().required(),
      signature_id: Yup.string().required(),
      product: Yup.string().required(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json('Dados inválidos, favor verificar');
    }

    // Criação da encomenda
    const newOrder = await Orders.create(req.body);

    return res.json({
      msg: 'Encomenda cadastrada com sucesso!',
      newOrder,
    });
  }

  async update(req, res) {
    // Validação dos dados recebidos
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      couriers_id: Yup.number(),
      signature_id: Yup.string(),
      product: Yup.string(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json('Dados inválidos, favor verificar');
    }

    // Validação da encomenda
    const checkOrder = await Orders.findByPk(req.params.id);

    if (!checkOrder) {
      return res.status(401).json('Encomenda não localizada');
    }

    // Atualização da encomenda
    await checkOrder.update(req.body);

    return res.json({
      msg: 'Encomenda atualizada com sucesso!',
      checkOrder,
    });
  }

  async delete(req, res) {
    // Validação da encomenda
    const checkOrder = await Orders.findByPk(req.params.id);

    if (!checkOrder) {
      return res.status(401).json('Encomenda não localizada');
    }

    // Remoção da encomenda
    await checkOrder.destroy(req.params.id);

    return res.json({ msg: 'Encomenda deletada com sucesso' });
  }
}

export default new OrdersController();
