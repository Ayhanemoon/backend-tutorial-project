const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);
router.delete('/:userId', userController.deleteUser);
router.patch('/:userId', userController.partiallyUpdateUser);

module.exports = router;
