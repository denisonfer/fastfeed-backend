import * as Yup from 'yup';
import { Op } from 'sequelize';
import Couriers from '../models/couriers';

class CouriersController {
  async index(req, res) {
    const search = req.query.q;

    if (search) {
      const findCourier = await Couriers.findAll({
        where: { name: { [Op.like]: `%${search}%` } },
      });
      return res.json({ findCourier });
    }

    const allCouriers = await Couriers.findAll();

    return res.json({ allCouriers });
  }

  async store(req, res) {
    // Validação dos dados de entrada
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json('Dados recebidos inválidos');
    }

    // Cadastro do entregador
    const newCourier = await Couriers.create(req.body);

    return res.json({
      msg: 'Entregador cadastrado com sucesso!',
      newCourier,
    });
  }

  async update(req, res) {
    // Validação dos dados de entrada
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json('Dados recebidos inválidos');
    }

    // Validação do entregador
    const checkCourier = await Couriers.findByPk(req.params.id);

    if (!checkCourier) {
      return res.status(401).json('Entregador não localizado!');
    }

    // Atualização do entregador
    await checkCourier.update(req.body);

    return res.json({
      msg: 'Entregador atualizado com sucesso!',
      checkCourier,
    });
  }

  async delete(req, res) {
    // Validação do entregador
    const checkCourier = await Couriers.findByPk(req.params.id);

    if (!checkCourier) {
      return res.status(401).json('Entregador não localizado!');
    }

    // deletar entregador
    await checkCourier.destroy(req.params.id);

    return res.json({
      msg: 'Entregador apagado com sucesso!',
    });
  }
}

export default new CouriersController();
