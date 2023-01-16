const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createNewUser,
  deleteUser,
  updateUser,
  activateUser,
  loginUser,
} = require("../../controllers/usersController");
const { protect } = require("../../middleware/userMiddleware");

router
  .route("/")
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(protect, deleteUser);

router.route("/activate").post(activateUser);
router.route("/login").post(loginUser);

module.exports = router;
