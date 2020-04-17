import * as Yup from 'yup';
import { Op } from 'sequelize';
import Orders from '../models/orders';
import Recipients from '../models/recipients';
import Couriers from '../models/couriers';
import Mail from '../../lib/mail';

class OrdersController {
  async index(req, res) {
    const search = req.query.q;

    if (search) {
      const findOrder = await Orders.findAll({
        where: { product: { [Op.like]: `%${search}%` } },
      });
      return res.json({ findOrder });
    }

    const allOrders = await Orders.findAll();

    return res.json({ allOrders });
  }

  async show(req, res) {
    // Validação do entregador
    const courier = await Couriers.findByPk(req.params.id);

    if (!courier) {
      return res.status(401).json('Entregador não localizado!');
    }

    // Busca encomenda para o entregador ONDE não esteja cancelada ou entregue.
    const listOrders = await Orders.findAll({
      where: { couriers_id: courier.id, canceled_at: null, end_date: null },
    });

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

    // Validação do destinatário
    const recipient = await Recipients.findByPk(req.body.recipient_id);

    if (!recipient) {
      return res.status(401).json('Destinatário não localizado!');
    }

    // Validação do entregador
    const courier = await Couriers.findByPk(req.body.couriers_id);

    if (!courier) {
      return res.status(401).json('Entregador não localizado!');
    }

    // Criação da encomenda
    const newOrder = await Orders.create(req.body);

    // Envio de E-mail para entregador
    await Mail.sendMail({
      to: `${courier.name} <${courier.email}>`,
      subject: 'Você tem uma encomenda',
      template: 'orderInfo',
      context: {
        courier: courier.name,
        product: newOrder.product,
        recipient: recipient.name,
      },
    });

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
