import Avatars from '../models/avatars';

class AvatarController {
  async store(req, res) {
    const { filename: path, originalname: name } = req.file;

    const newAvatar = await Avatars.create({ name, path });

    return res.json({
      msg: 'Upload realizado com sucesso!',
      newAvatar,
    });
  }
}

export default new AvatarController();
