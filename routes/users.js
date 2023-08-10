const router = require('express').Router();

const {
  getUsers,
  createUser,
  getUserById,
  updateAvatar,
  updateUser,
} = require('../controllers/user');

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/me', updateUser);
router.get('/:userId', getUserById);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
