import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/users';
import authConfig from '../../config/authConfig';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .required()
        .email(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json('Dados inválidos');
    }

    const { email, password } = req.body;

    const checkUser = await User.findOne({ where: { email } });

    if (!checkUser) {
      return res.status(404).json('E-mail não localizado');
    }

    if (!(await checkUser.checkPassword(password))) {
      return res.status(400).json('Senha não localizada');
    }

    return res.json({
      mensagem: 'sessão criada com sucesso!',
      id: checkUser.id,
      name: checkUser.name,
      email: checkUser.email,
      token: jwt.sign({ id: checkUser.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
