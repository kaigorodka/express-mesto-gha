const router = require('express').Router();

const {
  likeCard,
  dislikeCard,
  createCard,
  getCards,
  deleteCard,
} = require('../controllers/cards');

router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);
router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
module.exports = router;
