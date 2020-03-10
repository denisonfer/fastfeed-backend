const multer = require('multer');
const { extname, resolve } = require('path');
const crypto = require('crypto');

module.exports = {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'temp', 'up_avatars'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
