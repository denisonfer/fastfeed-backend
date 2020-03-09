import * as Yup from 'yup';
import User from '../models/users';

class UserController {
  async store(req, res) {
    // Validação dos dados de entrada
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json('Dados inseridos inválidos!');
    }

    // Criação do usuário no banco
    const newUser = await User.create(req.body);

    return res.json({ usuario: newUser });
  }

  async update(req, res) {
    const { userId } = req;

    return res.json({ ok: 'atualizado' });
  }
}

export default new UserController();
