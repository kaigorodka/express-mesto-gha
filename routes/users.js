const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateAvatar,
  updateUser,
  getUserInfo,
} = require('../controllers/user');

router.get('/', getUsers);
router.patch('/me', updateUser);
router.get('/:userId', getUserById);
router.patch('/me/avatar', updateAvatar);
router.get('/me', getUserInfo);
module.exports = router;
