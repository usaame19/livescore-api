import express from 'express';
import { validateUserLogin } from '../../validators/userValidator.js';
import { authenticate } from '../../middlewares/authMiddleware.js';
import { Logout, getUserProfile, loginUser, registerUser, getUserData } from '../../controllers/user/usersController.js';

const usersRouter = express.Router();



usersRouter.post('/register-user', registerUser);
usersRouter.post('/login-user', validateUserLogin, loginUser);
usersRouter.get('/get-user-profile', authenticate, getUserProfile);
usersRouter.post('/userdata',  getUserData);

usersRouter.post('/logout', Logout);

export default usersRouter;