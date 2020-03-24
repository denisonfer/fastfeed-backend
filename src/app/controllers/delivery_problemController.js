import * as Yup from 'yup';
import Delivery_problems from '../models/delivery_problems';
import Orders from '../models/orders';
import Mail from '../../lib/mail';
import Couriers from '../models/couriers';

class Delivery_problemsController {
  async index(req, res) {
    const listProblems = await Delivery_problems.findAll();

    return res.json(listProblems);
  }

  async show(req, res) {
    // Validação da encomenda
    const checkOrder = await Orders.findByPk(req.params.idOrder);

    if (!checkOrder) {
      return res.status(401).json('Encomenda não localizada');
    }

    const deliveryProblem = await Delivery_problems.findAll({
      where: { order_id: checkOrder.id },
    });

    return res.json(deliveryProblem);
  }

  async store(req, res) {
    // Validação do dados de entrada
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(401)
        .json('Dados inválidos, favor insira uma descrição válida');
    }

    // Validação da encomenda
    const checkOrder = await Orders.findByPk(req.params.idOrder);

    if (!checkOrder) {
      return res.status(401).json('Encomenda não localizada');
    }

    // Criação do problema
    const problem = await Delivery_problems.create({
      order_id: checkOrder.id,
      description: req.body.description,
    });

    return res.json({
      msg: 'Problema cadastrado com sucesso!',
      problem,
    });
  }

  async delete(req, res) {
    // Validação do relato do problema
    const checkProblem = await Delivery_problems.findByPk(
      req.params.idProblem,
      {
        include: [
          {
            model: Orders,
            as: 'order',
            attributes: ['id', 'product', 'couriers_id', 'canceled_at'],
          },
        ],
      }
    );

    if (!checkProblem) {
      return res.status(401).json('Problema não localizado');
    }

    // cancelamento da encomenda
    const order = await Orders.findByPk(checkProblem.order_id);
    await order.update({ canceled_at: new Date() });

    // Envio de E-mail para entregador
    const courier = await Couriers.findByPk(checkProblem.order.couriers_id);

    await Mail.sendMail({
      to: `${courier.name} <${courier.email}>`,
      subject: 'Encomenda cancelada',
      template: 'cancellation',
      context: {
        courier: courier.name,
        product: checkProblem.order.product,
      },
    });

    return res.json({
      msg: 'Cancelamento realizado com sucesso!',
      checkProblem,
    });
  }
}

export default new Delivery_problemsController();
