const router = require("express").Router();
const User = require("../models/user.js");

const {
  getUsers,
  createUser,
  getUserById,
  updateAvatar,
  updateUser,
} = require("../controllers/user.js");

router.get("/", getUsers);
router.post("/", createUser);
router.patch("/me", updateUser);
router.get("/:userId", getUserById);
router.patch("/me/avatar", updateAvatar);

module.exports = router;
