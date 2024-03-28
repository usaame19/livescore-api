import express from 'express';
import { validateUserLogin } from '../../validators/userValidator.js';
import { authenticate } from '../../middlewares/authMiddleware.js';
import { Logout, getUserProfile, loginUser, registerUser, getUserData, forgotPassword, resetPassword, checkToken, getUsers, deleteUser, updateUser, getUserById } from '../../controllers/user/usersController.js';

const usersRouter = express.Router();



usersRouter.post('/register-user', registerUser);
usersRouter.post('/login-user', validateUserLogin, loginUser);
usersRouter.get('/get-user-profile', getUserProfile);
usersRouter.get('/get-users', getUsers);
usersRouter.get('/get-user/:id', getUserById);
usersRouter.delete('/delete-user/:id', deleteUser);
usersRouter.patch('/update-user/:id', updateUser);

usersRouter.post('/userdata',  getUserData);
usersRouter.post('/forgot-password',  forgotPassword);
usersRouter.post('/reset-password',  resetPassword);
usersRouter.post('/check-token',  checkToken);

usersRouter.post('/logout', Logout);

export default usersRouter;