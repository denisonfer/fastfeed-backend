import * as Yup from 'yup';
import Recipients from '../models/recipients';

class RecipientsController {
  async store(req, res) {
    // Validação dos dados
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json('Dados recebidos inválidos');
    }

    const newRecipient = await Recipients.create(req.body);

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    } = newRecipient;

    return res.json({
      msg: 'Destinatário cadastrado com sucesso!',
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    });
  }

  async update(req, res) {
    // Validação dos dados
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json('Dados recebidos inválidos');
    }

    const idDestinatario = req.params.id;

    // Validação de destinatário
    const checkRecipients = await Recipients.findByPk(idDestinatario);

    if (!checkRecipients) {
      return res.status(401).json('Destinatário não cadastrado');
    }

    await checkRecipients.update(req.body);

    return res.json({
      msg: 'Usuário atualizado com sucesso',
      checkRecipients,
    });
  }
}

export default new RecipientsController();
